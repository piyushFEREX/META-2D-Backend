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

describe('User metaData endpoints',()=>{
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

    test('User can update their metadata with valid avatart id', async () => { 
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId
        },{
            "authorization": `Bearer ${token}`
        })
        expect(response).status.toBe(200)
     })

     test('User is not able to update thier metadata if the auth header is not present', async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`,{
            avatarId
        })
        expect(response).status.toBe(403)
     });
})

describe('User avatat information', () => { 
    let avatarId;
    let token;
    let userId;

    beforeAll(async ()=>{
        const username = `User-${Math.random}`
        const password = `123456`
        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:'admin'
        })
        userId = signupResponse.data.userId

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

    test('get back avatar information of a user', async () => {
       const response = await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`)
       expect(response.data.avatars.length).toBe(1)
       expect(response.data.avatars[0].userId).toBe(userId)
    });
    test('Available avatar listes the recentaly created avatar', async() => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`)
        expect(response.data.avatars.length).not.toBe(0)
        const currentAvatar = response.data.avatars.find(x => x.id == avatarId)
        expect(currentAvatar).toBeDefined()

    });
 })

 describe('Space infornmation',  () => { 
    let mapId 
    let element1Id
    let element2Id
    let AdminId
    let AdminToken
    let userId
    let userToken


    beforeAll(async ()=>{
        const username = `User-${Math.random}`
        const password = `123456`
        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username,
            password,
            type:'admin'
        })
        AdminId = signupResponse.data.userId

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password,
        })
         AdminToken = response.data.token     
    

        const element1 =  await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
          "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
        },{
            headers:{
                authorization:`Bearer ${AdminToken}`
            }
        })

        const element2 =  await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
          "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
        },{
            headers:{
                authorization:`Bearer ${AdminToken}`
            }
        })

        element1Id = element1.id
        element2Id = element2.id

        const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                    elementId: element1Id,
                    x: 20,
                    y: 20
                }, {
                  elementId: element1Id,
                    x: 18,
                    y: 20
                }, {
                  elementId: element2Id,
                    x: 19,
                    y: 20
                }
            ]
         },{
            headers:{
                authorization:`Bearer ${AdminToken}`
            }
        })

        mapId = map.id

})



  })