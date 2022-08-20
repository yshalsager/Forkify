import { TIMEOUT_SECONDS } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export async function AJAX(url, uploadData = undefined) {
  const fetchPromise = uploadData
    ? fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadData),
      })
    : fetch(url);
  try {
    const response = await Promise.race([
      fetchPromise,
      timeout(TIMEOUT_SECONDS),
    ]);
    const data = await response.json();
    if (!response.ok) throw new Error(`${data.message} ${response.status}`);
    return data;
  } catch (error) {
    throw error;
  }
}
// export async function getJSON(url) {
//   try {
//     const response = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
//     const data = await response.json();
//     if (!response.ok) throw new Error(`${data.message} ${response.status}`);
//     return data;
//   } catch (error) {
//     throw error;
//   }
// }

// export async function sendJSON(url, payload) {
//   try {
//     const response = await Promise.race([
//       fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       }),
//       timeout(TIMEOUT_SECONDS),
//     ]);
//     const data = await response.json();
//     if (!response.ok) throw new Error(`${data.message} ${response.status}`);
//     return data;
//   } catch (error) {
//     throw error;
//   }
// }
