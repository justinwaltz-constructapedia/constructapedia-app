//API call to create a new plan in DB, title is required
function postPlan(plan) {
    const access_token = localStorage.getItem('access_token');
    //const refresh_token = localStorage.getItem('refresh_token')
    return fetch( `https://constructapediawebapi.herokuapp.com/plan/`, {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify(plan)
    } )
    .then( (httpResponse) => {
      if (httpResponse.ok) {
        return httpResponse.json();
      } else {
        return Promise.reject("Fetch did not succeed");
      }
    } )
    .then( (json) => {
        console.log(typeof json.result, json.result)
        return json.result;
      })
    .catch(err => console.log(err));
}

//API call to get a single plan from DB
function getPlan (planId) {
    const access_token = localStorage.getItem('access_token');
    return fetch( `https://constructapediawebapi.herokuapp.com/plan/${planId}`, {
        method:"GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        }
    } )
    .then( (httpResponse) => {
      if (httpResponse.ok) {
        return httpResponse.json();
      } else {
        return Promise.reject("Fetch did not succeed");
      }
    } )
    .then( (json) => {
        return json.result;
      })
    .catch(err => console.log(err));
}

//API call to get all user plans from DB (should this just return id, title and major subplans?)
function getUserPlans() {
    const access_token = localStorage.getItem('access_token');
    const user_id = localStorage.getItem('user_id');
    return fetch( `https://constructapediawebapi.herokuapp.com/plans/`, {
        method:"GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        }
    } )
    .then( (httpResponse) => {
      if (httpResponse.ok) {
        return httpResponse.json();
      } else {
        return Promise.reject("Fetch did not succeed");
      }
    } )
    .then( (json) => {
        return json.result;
      })
    .catch(err => console.log(err));
}

//API call to update a single plan in DB, update object contains entire field(s) on the plan doc
function putPlanUpdate(planId, planUpdateObj) {
    const access_token = localStorage.getItem('access_token');
    console.log(planUpdateObj)
    let success;
    return fetch( `https://constructapediawebapi.herokuapp.com/plan/${planId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
      },
      body: JSON.stringify(planUpdateObj)
    } )
    .then((httpResponse) => {
        success = httpResponse.ok
        if (httpResponse.ok) {
            return httpResponse.json();
        } else {
            return Promise.reject("Fetch did not succeed");
        }
    })
    .then( (json) => {
        console.log(json, json.result)
        return success;
    })
    .catch(err => console.log(err));
}

function deletePlan(planId) {
    const access_token = localStorage.getItem('access_token');
    return fetch( `https://constructapediawebapi.herokuapp.com/plan/${planId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
      }
    } )
    .then((httpResponse) => {
        if (httpResponse.ok) {
            return httpResponse.json();
        } else {
            return Promise.reject("Fetch did not succeed");
        }
    })
    .then( (json) => {
        console.log(json, json.result)
        return json.result;
    })
    .catch(err => console.log(err));
}

export {getUserPlans, putPlanUpdate, postPlan, getPlan, deletePlan};

/*
function postNewProject (project) {
    const access_token = localStorage.getItem('access_token');
    //const refresh_token = localStorage.getItem('refresh_token')
    return fetch( `https://constructapediawebapi.herokuapp.com/projects/`, {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify(project)
    } )
    .then( (httpResponse) => {
      if (httpResponse.ok) {
        return httpResponse.json();
      } else {
        return Promise.reject("Fetch did not succeed");
      }
    } )
    .then( (json) => {
        console.log(typeof json.result, json.result)
        return json.result;
      })
    .catch(err => console.log(err));
}
function getUserProjects() {
    const access_token = localStorage.getItem('access_token');
    const user_id = localStorage.getItem('user_id');
    return fetch( `https://constructapediawebapi.herokuapp.com/projects/${user_id}`, {
        method:"GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        }
    } )
    .then( (httpResponse) => {
      if (httpResponse.ok) {
        return httpResponse.json();
      } else {
        return Promise.reject("Fetch did not succeed");
      }
    } )
    .then( (json) => {
        return json.result;
      })
    .catch(err => console.log(err));
}
function putProjectUpdate(projectUpdateObj) {
    const access_token = localStorage.getItem('access_token');
    const projectId = projectUpdateObj.id;
    const projectToSend = {
        title: projectUpdateObj.title,
        tools: projectUpdateObj.tools,
        materials: projectUpdateObj.materials,
        project_steps: projectUpdateObj.project_steps,
        video_urls: projectUpdateObj.video_urls
    }

    console.log(projectToSend)
    let success;
    return fetch( `https://constructapediawebapi.herokuapp.com/project/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
      },
      body: JSON.stringify(projectToSend)
    } )
    .then((httpResponse) => {
        success = httpResponse.ok
        if (httpResponse.ok) {
            return httpResponse.json();
        } else {
            return Promise.reject("Fetch did not succeed");
        }
    })
    .then( (json) => {
        console.log(json, json.result)
        return success;
    })
    .catch(err => console.log(err));
}
 */
