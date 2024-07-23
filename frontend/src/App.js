import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, EditableText, InputGroup, Toaster, Navbar, Alignment } from '@blueprintjs/core';
import './App.css';

const AppToaster = Toaster.create({
    position: "top"
});

function App() {
    const [users, setUsers] = useState([]);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newWebsite, setNewWebsite] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        axios.get('/users')
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);
   
    
    function addUser() {
        const name = newName.trim();
        const email = newEmail.trim();
        const website = newWebsite.trim();

        if (name && email && website) {
            const newUser = { name, email, website };

            axios.post('/users', newUser)
                .then((response) => {
                    setUsers([...users, response.data]);

                    AppToaster.show({
                        message: "User added successfully",
                        intent: 'success',
                        timeout: 3000
                    });

                    setNewName("");
                    setNewEmail("");
                    setNewWebsite("");
                })
                .catch((error) => {
                    console.error('Error adding user:', error);
                });
        }
    }

    function onChangeHandler(id, key, value) {
        setUsers((users) => {
            return users.map(user => {
                return user.id === id ? { ...user, [key]: value } : user;
            });
        });
    }

    function updateUser(id) {
        const user = users.find((user) => user.id === id);

        axios.put(`/users/${id}`, user)
            .then((response) => {
                AppToaster.show({
                    message: "User updated successfully",
                    intent: 'success',
                    timeout: 2000
                });
            })
            .catch((error) => {
                console.error('Error updating user:', error);
            });
    }

    function deleteUser(id) {
        axios.delete(`/users/${id}`)
            .then((response) => {
                setUsers((users) => {
                    return users.filter(user => user.id !== id);
                });

                AppToaster.show({
                    message: "User deleted successfully",
                    intent: 'success',
                    timeout: 3000
                });
            })
            .catch((error) => {
                console.error('Error deleting user:', error);
            });
    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.website.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar className="bg-blue-600 text-white">
                <Navbar.Group align={Alignment.LEFT}>
                    <Navbar.Heading>Staff Management</Navbar.Heading>
                </Navbar.Group>
                <Navbar.Group align={Alignment.RIGHT}>
                    <InputGroup
                        leftIcon="search"
                        placeholder="Search..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                    />
                </Navbar.Group>
            </Navbar>
            <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 p-4">
                <div className="w-full p-4 bg-white shadow-md rounded">
                    <table className='min-w-full bg-gray-50'>
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Email</th>
                                <th className="border px-4 py-2">Website</th>
                                <th className="border px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user =>
                                <tr key={user.id}>
                                    <td className="border px-4 py-2">{user.id}</td>
                                    <td className="border px-4 py-2">
                                        <EditableText onChange={value => onChangeHandler(user.id, 'name', value)} value={user.name} />
                                    </td>
                                    <td className="border px-4 py-2">
                                        <EditableText onChange={value => onChangeHandler(user.id, 'email', value)} value={user.email} />
                                    </td>
                                    <td className="border px-4 py-2">
                                        <EditableText onChange={value => onChangeHandler(user.id, 'website', value)} value={user.website} />
                                    </td>
                                    <td className="border px-4 py-2">
                                        <Button intent='primary' onClick={() => updateUser(user.id)}>Update</Button>
                                        &nbsp;
                                        <Button intent='danger' onClick={() => deleteUser(user.id)}>Delete</Button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="w-full p-4 bg-white shadow-md rounded mt-4">
                    <div className="flex flex-row items-center">
                        <InputGroup
                            className="mb-2 ml-52"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder='Enter Name...'
                        />
                        <InputGroup
                            className="mb-2 ml-10"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder='Enter Email...'
                        />
                        <InputGroup
                            className="mb-2 ml-10"
                            value={newWebsite}
                            onChange={(e) => setNewWebsite(e.target.value)}
                            placeholder='Enter Website...'
                        />
                        <Button className="mb-2 ml-5" intent='success' onClick={addUser}>Add User</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default App;
