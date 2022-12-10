const apiUrl = process.env.API_URL || 'http://localhost:8080';
import { loadFragments, user } from './app';
import { getUser } from './auth';

window.deleteFragment = async function deleteFragment(id) {
  try {
    let user = await getUser();
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: 'DELETE',
      headers: user.authorizationHeaders()
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    console.log('Fragment deleted:', id);
    await loadFragments();
    return true;
  } catch (err) {
    console.error('Unable to call DELETE /v1/fragment', { err });
  }
}

window.updateFragment = async function updateFragment(id) {
  let user = await getUser();
  try {
    const file = document.getElementById('file/'+id).files[0];
    const content = await getBuffer(file);
    let type = file.type;
    if (file.name.endsWith('.md')) {
      type = 'text/markdown';
    }
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: 'PUT',
      headers: {
        ...user.authorizationHeaders(),
        'Content-Type': type
      },
      body: content
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Fragment posted', { data });
    await loadFragments();
    return true;
  } catch (err) {
    console.error('Unable to call POST /v1/fragment', { err });
  }
  await loadFragments();
}

function getBuffer(fileData) {
  return new Promise((resolve) => {
    var reader = new FileReader();
    reader.readAsArrayBuffer(fileData);
    reader.onload = function() {
      resolve(new Uint8Array(reader.result));
    }
  })
}

export async function postTextFragment(user) {
  try {
    const content = await getBuffer(document.getElementById('content').files[0]);
    let type = document.getElementById('content').files[0].type;
    if (document.getElementById('content').files[0].name.endsWith('.md')) {
      type = 'text/markdown';
    }
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: 'POST',
      headers: {
        ...user.authorizationHeaders(),
        'Content-Type': type
      },
      body: content
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Fragment posted', { data });
    await loadFragments();
    return true;
  } catch (err) {
    console.error('Unable to call POST /v1/fragment', { err });
  }
}

export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data', { data });

    let fragments = await Promise.all(data.fragments
      .map(async el => {
        const fragment = await fetch(`${apiUrl}/v1/fragments/${el.id}`, {
          headers: user.authorizationHeaders(),
        });
        const contentType = fragment.headers.get('Content-Type');
        let row = '';

        if (contentType.startsWith('text/') || contentType.startsWith('application/json')) row += `<p>${await fragment.text()}</p>`;
        else {
          row += `<img src="${URL.createObjectURL(await fragment.blob())}">`
        }
        row += `<p style="font-size: 0.8em;">${el.id}
        <br />
        ${el.type}
        <br />
        ${el.size} bytes
        <br />
        Last updated on ${new Date(el.updated).toLocaleString()}</p>
        <button onclick="deleteFragment('${el.id}')">Delete</button>
        <input type="file" id="file/${el.id}" name="content" style="width: 400px;">
        <button onclick="updateFragment('${el.id}')">Update</button>`
        return row;
      })
    )
    return fragments.join('\n<hr style="margin-top: 1em;" />\n');
    
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}