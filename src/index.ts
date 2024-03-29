const getUserName=document.querySelector('#user') as HTMLInputElement;
const formSubmit=document.querySelector('#form') as HTMLFormElement;
const main_container=document.querySelector('.main-container') as HTMLElement;


// so lets define the contract of an object
interface UserData {
    id:number;
    login:string;
    avatar_url:string;
    location:string;
    url:string;
}

const myCustomFetacher=async<T>(url:string,options?:RequestInit):Promise<T>=>{
    const response = await fetch(url,options)
    if(!response.ok){
        throw new Error(
            `Network response was not ok - status:${response.status}`
        );
    }
    const data =await response.json();
    // console.log(data)
    return data;

}

const showResult=(singleUser:UserData)=>{
    const {login,avatar_url,url} = singleUser;
    // console.log(url)
    main_container.insertAdjacentHTML(
        "beforeend",
        `<div class='card'>
           <img src=${avatar_url} alt=${login}/>
           <hr/>
           <div class="card-footer">
             <img src=${avatar_url} alt=${login}/>
             <a href=${url}>Github</a>
           </div>
        </div>`
    )
}

const fetchUserData=(url:string)=>{
   myCustomFetacher<UserData[]>(url,{}).then((userInfo)=>{
     for(const singleUser of userInfo){
        showResult(singleUser)
        // console.log(singleUser.id)
     }
   })
}


//default function call
fetchUserData('https://api.github.com/users');

// let perform search funtionality
formSubmit.addEventListener("submit",async(e)=>{
    e.preventDefault();
    const searchTerm = getUserName.value.toLocaleLowerCase();
    try {

        const url = "https://api.github.com/users"
        
        const allUserData = await myCustomFetacher<UserData[]>(url,{});
        const matchingUserData=allUserData.filter((user)=>{
              return user.login.toLowerCase().includes(searchTerm)
        })

        main_container.innerHTML=""

        if(matchingUserData.length === 0){
           main_container.insertAdjacentHTML(
            'beforeend',
            `<p class="empty-msg">No matching users found</p>`
           )
        }else{
            for(const singleUser of matchingUserData){
                showResult(singleUser)
            }
        }

    } catch (error) {
        console.log(error)
    }
})
