"use strict";
const getUserName = document.querySelector('#user');
const formSubmit = document.querySelector('#form');
const main_container = document.querySelector('.main-container');
const myCustomFetacher = async (url, options) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Network response was not ok - status:${response.status}`);
    }
    const data = await response.json();
    // console.log(data)
    return data;
};
const showResult = (singleUser) => {
    const { login, avatar_url, url } = singleUser;
    // console.log(url)
    main_container.insertAdjacentHTML("beforeend", `<div class='card'>
           <img src=${avatar_url} alt=${login}/>
           <hr/>
           <div class="card-footer">
             <img src=${avatar_url} alt=${login}/>
             <a href=${url}>Github</a>
           </div>
        </div>`);
};
const fetchUserData = (url) => {
    myCustomFetacher(url, {}).then((userInfo) => {
        for (const singleUser of userInfo) {
            showResult(singleUser);
            // console.log(singleUser.id)
        }
    });
};
//default function call
fetchUserData('https://api.github.com/users');
// let perform search funtionality
formSubmit.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = getUserName.value.toLocaleLowerCase();
    try {
        const url = "https://api.github.com/users";
        const allUserData = await myCustomFetacher(url, {});
        const matchingUserData = allUserData.filter((user) => {
            return user.login.toLowerCase().includes(searchTerm);
        });
        main_container.innerHTML = "";
        if (matchingUserData.length === 0) {
            main_container.insertAdjacentHTML('beforeend', `<p class="empty-msg">No matching users found</p>`);
        }
        else {
            for (const singleUser of matchingUserData) {
                showResult(singleUser);
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
