import React from 'react'

export default function Register() {
    async function registerUser(e){
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:3003/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: e.target.name.value,
                    email: e.target.email.value,
                    password: e.target.password.value
                })
            })
            const data = await response.json();
            console.log(data);
        } catch (err) {
            console.log('Request failed:', err)
            alert('Registration failed. Please try again.',err);
        }
        alert('Registration successful! Please log in.');
    }   
  return (
    <div>


        <form className="flex flex-col gap-4 bg-gray-100 p-4 rounded w-3/4 mx-auto" onSubmit={registerUser}>
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <input type="text" placeholder="Username" className="border border-black p-2 rounded" name="name" />
            <input type="email" placeholder="Email" className="border border-black p-2 rounded" name="email" />
            <input type="password" placeholder="Password" className="border border-black p-2 rounded" name="password" />
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Register
            </button>
        </form>
    </div>
  )
}
