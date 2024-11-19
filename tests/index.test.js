const { default: axios } = require("axios")

const sum =(a,b)=>{
    return a+b
}

const BACKEND_URL = `https://reqres.in`

describe('Auth',()=>{

    test('User is able to sign up only Once', async()=>{
        const username = 'user1' + Math.random();
        const password = '123456'
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:'admin'
        })
        expect(response.status).toBe(200)

        const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:'admin'
        })
        expect(updatedResponse.status).toBe(400)
    })

    test('Signup request fails if the username is empty', async ()=>{
        const username = `user-${Math.random()}`
        const password = `123456`
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            password
        })
        expect(response.status).toBe(400)
    })

    test('SignIn Sucess if the username and the password are correct',async ()=>{
        const username = `user-${Math.random()}`
        const password = `123456`
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password
        })
        expect(response.status).toBe(200) 
        expect(response.body.token).toBeDefined()
    })

    test('SignIn fails if the username and password are incorrect',async ()=>{
        const username = `User-${Math.random()}`
        const password = `123456`
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username:'WrongUsername',
            password
        })
        expect(response.status).toBe(403)
    })
})

describe('User Information endpoints',()=>{
    let token = ''
    let avatarId = ''

    beforeAll(async ()=>{
        const username = `User-${Math.random}`
        const password = `123456`
        await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:'admin'
        })

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password,
        })
         token = response.data.token

         const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        })

        avatarId = avatarResponse.data.avatarId
    })

    test("User can't Update their metadata with wrong avatar ID", async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId:'123123123'
        },{
            "authorization": `Bearer ${token}`
        })
        expect(response).status.toBe(400)
    })
})