// todo take token from api
// const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNGY1ODUxNDRhOTIzYzE2Nzc2M2FkM2M3NzEyZDllMSIsIm5iZiI6MTcyMzUxMTA5Ni41NDYzNzEsInN1YiI6IjY2YmFhZWViMmZiODRkZjc4ZTkxMzc5MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Re6iY3DVoorhVEwuiomrNKfqN6jUMhHsuVCTToJsPXE';

const options = {
    method: 'GET',
    // credentials: 'include',
    headers: {
      accept: 'application/json',
    }
}

export const getAllUsers = async () : Promise<any> => {
    const response = await fetch('http://localhost:5000/admin/users', options)
    const data = await response.json()
    return data.data

}