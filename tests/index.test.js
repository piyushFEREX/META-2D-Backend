const { default: axios } = require("axios")

const sum =(a,b)=>{
    return a+b
}

const BACKEND_URL = `https://reqres.in`
const Ws_URL = ``


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

describe('User avatar information', () => { 
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
    
         const UserSignUpResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username:  username + '-User',
            password,
        })
        userId = UserSignUpResponse.data.userId

        const UserSignInResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username:  username + '-User',
            password,
        })
         userToken = UserSignInResponse.data.token



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
    test("User is able to create a space", async () => {

        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
        "name": "Test",
        "dimensions": "100x200",
        "mapId": mapId
    }, {
        headers: {
            authorization: `Bearer ${userToken}`
        }
    })
    expect(response.status).toBe(200)
    expect(response.data.spaceId).toBeDefined()
    })
    test("User is able to create a space without mapId (empty space)", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
        "name": "Test",
        "dimensions": "100x200",
    }, {
        headers: {
            authorization: `Bearer ${userToken}`
        }
    })

    expect(response.data.spaceId).toBeDefined()
    })
    test('User is not  able to create a space without a space id and dimentions', async() => {
        const response = axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "Test",
       },{
        headers:{
            authorization:`Bearer ${userToken}`
        }
       })

       expect(response.statusCode).toBe(400)
    });
    test('User is not able to delete a space tht do not exist', async () => {
        const response = await axios.delete(`${BACKEND_URL}/api/v1/space/randomIdDoesNotExist`,{
            "name":"test"
        },{
            headers:{
                authorization:`Bearer ${userToken}`
            }
           })
     expect(response.status).toBe(400)   
    });
    test('User is able to delete a space that does Exist',async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":'test',
            "dimensions":"100x200"
        },{
            headers:{
                authorization:`Bearer ${userToken}`
            }
           })

        const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,{
            headers:{
                authorization:`Bearer ${userToken}`
            }
           })
        expect(deleteResponse.status).toBe(200)
    });
    test('User should not be able to delete a space created by another user',async () => {
     
       
            const response = await axios.post(`${BACKEND_URL}/api/v1/space`,{
                "name":'test2',
                "dimensions":"100x200"
            },{
                headers:{
                    authorization:`Bearer ${userToken}`
                }
               })
    
            const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,{
                headers:{
                    authorization:`Bearer ${AdminToken}`
                }
               })
            expect(deleteResponse.status).toBe(400)
    });
    test('Admin has no spaces initially',async () => {
      const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`,{
        headers:{
            authorization:`Bearer ${userToken}`
        }
       })
        expect(response.data.spaces.length).toBe(0)
    });
    test('Admin has no spaces initially',async () => {
        const spaceCreateResponse = await axios.post(`${BACKEND_URL}/api/v1/sapce/all`,{
            "name":'Testt',
            "dimensions":"100x200"
        },{
            headers:{
                authorization:`Bearer ${userToken}`
            }
           })

           const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`,{
            headers:{
                authorization:`Bearer ${userToken}`
            }
           })
           const filterdResposne = response.data.spaces.find(x => x.id == spaceCreateResponse.spaceId)
           expect(response.data.spaces.length).toBe(1)
           expect(filterdResposne).toBeDefined()
    });
})

describe('Arena Endpoints', () => { 
    let mapId 
    let element1Id
    let element2Id
    let AdminId
    let AdminToken
    let userId
    let userToken
    let spaceId


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
    
         const UserSignUpResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username:  username + '-User',
            password,
        })
        userId = UserSignUpResponse.data.userId

        const UserSignInResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username:  username + '-User',
            password,
        })
         userToken = UserSignInResponse.data.token



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

        const space = await axios.post(`${BACKEND_URL}/api/v1/spce`,{
          "name": "Test",
          "dimensions": "100x200",
          "mapId": mapId
       },{
        headers:{
            authorization:`Bearer ${userToken}`
        }
       })
        spaceId = space.spaceId
})  
    test('incorrect space id returns a 400 ',async () => {
       const response = await axios.get(`${BACKEND_URL}/api/v1/spaces/asdastwe3340`)
       expect(response.status).toBe(400)
    });
    test('Correct space id returns all the elements ',async () => {
       const response = await axios.get(`${BACKEND_URL}/api/v1/spaces/${spaceId}`)
       expect(response.data.dimensions).toBe("100x200")
       expect(response.data.elements.length).toBe(3)
    });
    test('Delete endpoint is able to delete an element',async () => {
        const elementResponse = await axios.get(`${BACKEND_URL}/api/v1/spaces/${spaceId}`)
        
        await axios.delete(`${BACKEND_URL}/api/v1/spaces/element`,{
            spaceId :spaceId,
            elementId: elementResponse.data.elements[0].id
        })
        
        
        const NewResponse = await axios.get(`${BACKEND_URL}/api/v1/spaces/${spaceId}`)
        expect(NewResponse.data.elements.length).toBe(2)
    });
    test('Adding an element fails if it is outside the dimensions',async () => {
        const response =  await axios.post(`${BACKEND_URL}/api/v1/spaces/element`,{
            "elementId": element1Id,
            "spaceId": spaceId,
            "x": 50000,
            "y": 200000
        })
        expect(response.response).toBe(404)
    });
    test('Adding an element works as expected',async () => {
       await axios.post(`${BACKEND_URL}/api/v1/spaces/element`,{
        "elementId": element1Id,
        "spaceId": spaceId,
        "x": 50,
        "y": 20
      })


       const NewResponse = await axios.get(`${BACKEND_URL}/api/v1/spaces/${spaceId}`)
       expect(NewResponse.data.elements.length).toBe(3)
    });
    
 })

 describe("Admin Endpoints", () => {
    let adminToken;
    let adminId;
    let userToken;
    let userId;

    beforeAll(async () => {
        const username = `kirat-${Math.random()}`
        const password = "123456"
 
        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
         username,
         password,
         type: "admin"
        });

        adminId = signupResponse.data.userId
 
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
         username: username,
         password
        })
 
        adminToken = response.data.token

        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: username + "-user",
            password,
            type: "user"
        });
   
        userId = userSignupResponse.data.userId
    
        const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: username  + "-user",
            password
        })
    
        userToken = userSigninResponse.data.token
    });

    test("User is not able to hit admin Endpoints", async () => {
        const elementReponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
          "static": true
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        });

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "test space",
            "defaultElements": []
         }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        }, {
            headers: {
                "authorization": `Bearer ${userToken}`
            }
        })

        const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/123`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        }, {
            headers: {
                "authorization": `Bearer ${userToken}`
            }
        })

        expect(elementReponse.status).toBe(403)
        expect(mapResponse.status).toBe(403)
        expect(avatarResponse.status).toBe(403)
        expect(updateElementResponse.status).toBe(403)
    })

    test("Admin is able to hit admin Endpoints", async () => {
        const elementReponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
          "static": true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "name": "Space",
            "dimensions": "100x200",
            "defaultElements": []
         }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        }, {
            headers: {
                "authorization": `Bearer ${adminToken}`
            }
        })
        expect(elementReponse.status).toBe(200)
        expect(mapResponse.status).toBe(200)
        expect(avatarResponse.status).toBe(200)
    })
 
    test("Admin is able to update the imageUrl for an element", async () => {
        const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
          "static": true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });

        const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.id}`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
        }, {
            headers: {
                "authorization": `Bearer ${adminToken}`
            }
        })

        expect(updateElementResponse.status).toBe(200);

    })
});

describe("WebSocket tests", () => {
    let adminToken;
    let adminId;
    let userToken;
    let userId;
    let element1Id;
    let element2Id;
    let spaceId;
    let mapId;
    let Ws1;
    let Ws2;
    let Ws1Messages=[];
    let Ws2Messages=[];

    function waitForAndPopLatestMessage(messageArray){
        return new Promise(r =>{
            if(messageArray.length>0){
                resolve(messageArray.shift())
            }
            else{
                let interval = setInterval(() => {
                  if(messageArray.length>0){
                    resolve(messageArray.shift())
                    clearInterval(interval)
                    }
                }, 100);
            }
        })
    }

    async function setUpHTTP(){
        const username = `User-${Math.random()}`;
        const password = `123456`;

        // Admin signup and sign in
        const adminSignUpResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: 'admin',
        });

        const adminSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password,
        });
        adminToken = adminSigninResponse.data.token;
        adminId = adminSignUpResponse.data.userId;

        // User signup and sign in
        const userSignUpResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: username + '-User',
            password,
        });

        const userSignInResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: username + '-User',
            password,
        });

        userId = userSignUpResponse.data.userId;
        userToken = userSignInResponse.data.token;

        // Create elements
        const element1 = await axios.post(
            `${BACKEND_URL}/api/v1/admin/element`,
            {
                imageUrl: "https://example.com/image1.png",
                width: 1,
                height: 1,
                static: true, // Indicates collision
            },
            {
                headers: {
                    authorization: `Bearer ${adminToken}`,
                },
            }
        );

        const element2 = await axios.post(
            `${BACKEND_URL}/api/v1/admin/element`,
            {
                imageUrl: "https://example.com/image2.png",
                width: 1,
                height: 1,
                static: true,
            },
            {
                headers: {
                    authorization: `Bearer ${adminToken}`,
                },
            }
        );

        element1Id = element1.data.id;
        element2Id = element2.data.id;

        // Create map
        const map = await axios.post(
            `${BACKEND_URL}/api/v1/admin/map`,
            {
                thumbnail: "https://example.com/thumbnail.png",
                dimensions: "100x200",
                name: "100 person interview room",
                defaultElements: [
                    { elementId: element1Id, x: 20, y: 20 },
                    { elementId: element1Id, x: 18, y: 20 },
                    { elementId: element2Id, x: 19, y: 20 },
                ],
            },
            {
                headers: {
                    authorization: `Bearer ${adminToken}`,
                },
            }
        );

         mapId = map.data.id;

        // Create space
        const space = await axios.post(
            `${BACKEND_URL}/api/v1/space`,
            {
                name: "Test",
                dimensions: "100x200",
                mapId: mapId,
            },
            {
                headers: {
                    authorization: `Bearer ${userToken}`,
                },
            }
        );

        spaceId = space.data.spaceId;

    }
    async function setupWs(){
        Ws1 = new WebSocket(Ws_URL)
        Ws2 = new WebSocket(Ws_URL)

        await new Promise(r =>{
            Ws1.onopen = r
        })
        await new Promise(r =>{
            Ws2.onopen = r
        })
        Ws1.onmessage = (event)=>{
            Ws1Messages.push(JSON.parse(event.data))
        }
        Ws2.onmessage = (event)=>{
            Ws2Messages.push(JSON.parse(event.data))
        }


    }


    beforeAll(async () => {
          });

});
