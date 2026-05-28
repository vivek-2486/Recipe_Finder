let base_url = "https://www.themealdb.com/api/json/v1/1/"

let srchInput = document.querySelector(".search")
let srchBtn = document.querySelector(".search-btn")
let errMsg = document.querySelector("#error-res")
let searchingT = document.querySelector(".searching")
let successT = document.querySelector(".success-res")
let listM = document.querySelector("#srch-res")
let mealsContainer = document.querySelector(".meals-container")
let backBut = document.querySelector(".back-btn")
let srchCont = document.querySelector(".srch-content")

async function searchEng() {
    let sear = srchInput.value.trim();
    let srchUrl = `${base_url}${"search.php?s="}${sear}`
    searchingT.classList.remove("hidden")
    searchingT.innerHTML = "<div>Searching the web...</div>"
    let promi = await fetch(srchUrl)
    let data = await promi.json()
    searchingT.classList.add("hidden")
    console.log(data)
    return data
}

async function getMeals() {

    srchCont.classList.add("hidden");
    backBut.classList.add("hidden");
    listM.classList.add("hidden");
    srchCont.innerHTML = "";

    
    let data = await searchEng();
    let mealsList = data.meals
    try {
    if(!mealsList){
        errMsg.classList.remove("hidden")
        return;
    }
    else{
        errMsg.classList.add("hidden")
        successT.innerText = `The recepies for ${srchInput.value}`
        successT.classList.remove("hidden")
        displayMeals(mealsList)
    }  
    } catch (error) {
        errMsg.textContent = "Something unexpected happen"
        errMsg.classList.remove("hidden")
    }

    console.log(mealsList)
}

srchBtn.addEventListener("click",getMeals)
srchInput.addEventListener("keydown",(e) => {
    if(e.key === "Enter"){
        getMeals()
    }
})
backBut.addEventListener("click",(() => {
            srchCont.classList.add("hidden");
            backBut.classList.add("hidden")

            document.querySelector(".search-body").scrollIntoView({
                behavior:"smooth"
            })
}))
    
mealsContainer.addEventListener("click",mealDetails)

async function displayMeals(mealsList) {
    mealsContainer.innerHTML = ""
    mealsList.forEach(meal => {
        mealsContainer.innerHTML += `
        <div class="meal" id="${meal.idMeal}">
            <img src ="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="meal-info">
            <h3 class="meal-title">${meal.strMeal}</h3>
            ${meal.strCategory ? `<div class ="meal-category">${meal.strCategory}</div>` : ""}
            </div>
        
        </div>        
        `
    });
}
async function mealDetails(e) {
    console.log("inside the container")
    const mealEl = e.target.closest(".meal")
    if(!mealEl) return
    let mealD = await fetch(`${base_url}lookup.php?i=${mealEl.id}`)
    let data = await mealD.json();
    console.log(data);
    //backBut.classList.remove("hidden");
    try {
        if(!data.meals){
            listM.innerHTML = "<div>Something wrong happened</div>"

        }
        else{
            srchCont.classList.remove("hidden");
            backBut.classList.remove("hidden");
            listM.classList.remove("hidden");
            srchCont.scrollIntoView({
                behavior: "smooth"
            });

            let el = data.meals[0]
            let i = 1;
            const ingredArr = [];
            while(el[`strIngredient${i}`]){
                ingredArr.push({
                    ingName : el[`strIngredient${i}`],
                    ingAmo : el[`strMeasure${i}`]
                })
                i++;
            }
            console.log(ingredArr)
            srchCont.innerHTML = `<div class ="mainBody">
                <div class = "name"> <p>${el.strMeal}</p>
                <img src ="${el.strMealThumb}" alt="${el.strMeal}">
                <div class= "instru">${el.strInstructions}</div>
                <div class= "ingrdList">Ingredients</div>
                <div class= "vizeo"><a href="${el.strYoutube}">For video tutorial</a></div>
            </div>
            `
            let ingredientList = srchCont.querySelector(".ingrdList")
            console.log(ingredientList)
            for(let j = 0; j<ingredArr.length; j++){
                ingredientList.innerHTML += `<div>${ingredArr[j].ingName} : ${ingredArr[j].ingAmo}</div>`
            }

        }
    } catch (e) {
        errMsg.textContent = "Could not load recipe details. Please try again later.";
        errMsg.classList.remove("hidden");
    }
}