// bombastic one might say

let bombasticNumber = 2;
let boom = '';
let checkboxes = '';
let isChecked = '';

// Object to store task data
let bombasticObject = {}

// Fetch existing data from the server when the page loads
async function loadData() {
    try {
        const response = await fetch('/load', {
            method: 'GET', // GET request method
            headers: {
                'Content-Type': 'application/json', // Optional, specify that you're expecting JSON
                // Add any additional headers if needed (e.g., Authorization headers, etc.)
            },
            credentials: 'include' // Ensure cookies are included in the request if needed        
        }); // GET request to the server
        if (!response.ok) throw new Error('Failed to fetch data');
        
        bombasticObject = await response.json(); // Parse JSON response
        // console.log('Data loaded:', bombasticObject);

        // Restore bombasticNumber and tasks
        bombasticNumber = bombasticObject["bombasticNumber"] || 2;

        document.querySelector('body').innerHTML = bombasticObject["tododata"] || '';

        // Restore checkbox states
        document.querySelectorAll('.he').forEach((checkbox, index) => {
            isChecked = bombasticObject['checkbox' + index] === true;
            checkbox.checked = isChecked;
        });

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Function to delete a node
function deleter(p) {
    document.querySelector('.tada' + p).remove();
}

// Function to add a new task
function newtaskr() {
    if (bombasticObject["bombasticNumber"] == null || bombasticObject["bombasticNumber"] == "null") {
        // Do nothing
    } else {
        bombasticNumber = bombasticObject["bombasticNumber"];
    }

    document.body.insertAdjacentHTML('beforeend', `
        <div class="tada tada${bombasticNumber}">
        <div class="task flex">
            <input type="checkbox" name="Hello world" class="he"><textarea type="text" class="tasktext" rows="1">Click here</textarea>
        </div>
        <div class="dele flex" onclick="deleter('${bombasticNumber}')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                <path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                <path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
        </div>
    </div>
    `);

    bombasticNumber++;
    bombasticObject["bombasticNumber"] = bombasticNumber;
}

// Function to save tasks and send data to server
async function saveboy() {
    checkboxes = document.querySelectorAll('.he');
    checkboxes.forEach((checkbox, index) => {
        bombasticObject['checkbox' + index] = checkbox.checked;
    });

    boom = document.querySelectorAll('textarea');
    boom.forEach((textarea) => {
        textarea.innerHTML = textarea.value;
    });

    bombasticObject["tododata"] = document.querySelector('body').innerHTML;

    // Send the data to the server
    try {
        const response = await fetch('/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bombasticObject)
        });

        if (!response.ok) throw new Error('Failed to save data');

        alert('Your data has been saved!');
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Failed to save data.');
    }
}

//logout function
async function logout(){
    const respons = await fetch('/logout', {
        method: 'POST', // Use POST for logout
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // Include cookies if used for auth
    });
    window.location.href = '/regauth'
        
    }

// Load data when the page loads
window.onload = ()=>{
    loadData()
}


// boom boom

// Function to refresh the access token

// Function to refresh the access token
// async function refreshAccessToken() {
//     try {
//         const response = await fetch('/refresh', {
//             method: 'POST',
//             credentials: 'include' // Include cookies in the request (access and refresh token)
//         });

//         if (!response.ok) {
//             // If refresh fails (e.g., refresh token expired), redirect to login page
//             throw new Error('Refresh token expired or invalid');
//         }

//         // No need to extract the access token from the response body as it's set in the HTTP-only cookie
//     } catch (error) {
//         console.error('Error refreshing access token:', error);
//         // Redirect to login if refresh fails
//         window.location.href = '/refresh'; // Replace '/login' with your actual login page URL
//         throw error; // Re-throw the error so it can be handled by the calling function
//     }
// }

// // Function to handle requests with automatic token refresh
// async function fetchWithRefreshToken(url, options = {}) {
//     // Send the initial request with credentials to include cookies (access token automatically sent)
//     let response = await fetch(url, {
//         ...options,
//         credentials: 'include' // Ensure cookies are included in the request
//     });

//     // If the access token has expired (401 Unauthorized), attempt to refresh it
//     if (response.status === 401) {
//         await refreshAccessToken(); // Refresh the access token
//         // Retry the request with the new access token (browser will send updated access token automatically)
//         response = await fetch(url, {
//             ...options,
//             credentials: 'include' // Include cookies again (browser will send updated access token)
//         });
//     }

//     return response;
// }
