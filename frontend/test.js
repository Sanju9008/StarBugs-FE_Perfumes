import axios from 'axios';

async function test() {
  try {
    let token = '';
    try {
        const regRes = await axios.post('http://localhost:8080/api/auth/register', {
        username: 'testuser' + Date.now(),
        email: 'test' + Date.now() + '@test.com',
        password: 'Password@123!',
        confirmPassword: 'Password@123!'
        });
        token = regRes.data.token;
    } catch(e) {
        console.log("Registration error", e.response?.data || e.message);
    }
    
    if (!token) {
        console.log("No token, exiting");
        return;
    }
    
    const res = await axios.get('http://localhost:8080/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Products count:", res.data.length);
    const cat2 = res.data.find(p => p.category?.categoryId === 2);
    const cat3 = res.data.find(p => p.category?.categoryId === 3);
    
    console.log("Men's Perfume Sample (Cat 2):");
    console.log(JSON.stringify(cat2, null, 2));
    
    console.log("Luxury Perfume Sample (Cat 3):");
    console.log(JSON.stringify(cat3, null, 2));
  } catch (e) {
    console.log("Error:", e.response?.data || e.message);
  }
}
test();
