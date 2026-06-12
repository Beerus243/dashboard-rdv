const body = JSON.stringify({
  email: process.argv[2] ?? 'malangaj94@gmail.com',
  password: process.argv[3] ?? 'test',
});

fetch('https://backendrdv-jf71.onrender.com/admin/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Origin: 'http://localhost:3000',
  },
  body,
})
  .then(async (res) => {
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('CORS allow-origin:', res.headers.get('access-control-allow-origin'));
    console.log('Body:', text);
  })
  .catch((err) => console.error('Fetch error:', err.message));
