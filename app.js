// Array to store recent searches
const recentSearches = [];

// Function to search meal categories based on user input
function searchCategories() {
    const categoryInput = document.getElementById('categoryInput').value;
    const listElement = document.getElementById('searchedCategoriesList');

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryInput}`)
        .then(response => response.json())
        .then(data => {
            listElement.innerHTML = ''; // Clear existing categories

            // Create a new row for every three images
            let rowElement;
            data.meals.forEach((meal, index) => {
                if (index % 3 === 0) {
                    rowElement = document.createElement('div');
                    rowElement.className = 'row'; // You may want to add a CSS class for styling
                    listElement.appendChild(rowElement);
                }

                // Create li and img elements
                const liElement = document.createElement('li');
                const imgElement = document.createElement('img');

                imgElement.src = meal.strMealThumb; // Assuming strMealThumb contains the image URL
                imgElement.alt = meal.strMeal;
                imgElement.className = 'meal-image'; // Add a class for styling if needed

                liElement.textContent = meal.strMeal;
                liElement.appendChild(imgElement);

                liElement.addEventListener('click', () => showMealDetails(meal.idMeal));
                rowElement.appendChild(liElement);
            });

            // Add the searched category to recent searches
            if (!recentSearches.includes(categoryInput)) {
                recentSearches.push(categoryInput);
                updateRecentSearches();
            }
        })
        .catch(error => {
            console.error('Error fetching searched categories:', error);
        });
}

// Function to update the list of recent searches
function updateRecentSearches() {
    const listElement = document.getElementById('recentSearchesList');
    listElement.innerHTML = ''; // Clear existing recent searches
    recentSearches.forEach(search => {
        const liElement = document.createElement('li');
        liElement.textContent = search;
        listElement.appendChild(liElement);
    });
}

// Function to show details of a selected meal
function showMealDetails(mealId) {
    // Fetch details for the selected meal
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];

            // Update the modal with ingredients and recipe
            const modalIngredientsList = document.getElementById('modalIngredientsList');
            const modalRecipeList = document.getElementById('modalRecipeList');

            modalIngredientsList.innerHTML = ''; // Clear existing ingredients
            for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                if (ingredient && measure) {
                    const liElement = document.createElement('p');
                    liElement.textContent = `${ingredient}: ${measure}`;
                    modalIngredientsList.appendChild(liElement);
                }
            }

            modalRecipeList.innerHTML = ''; // Clear existing recipe
            const recipeSteps = meal.strInstructions.split('\r\n');
            recipeSteps.forEach(step => {
                if (step.trim() !== '') {
                    const liElement = document.createElement('p');
                    liElement.textContent = step;
                    modalRecipeList.appendChild(liElement);
                }
            });

            // Show the modal
            const modal = document.getElementById('mealModal');
            modal.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching meal details:', error);
        });
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('mealModal');
    modal.style.display = 'none';
}

// Function to fetch and display a random meal
function getRandomMeal() {
    const randomMealImage = document.getElementById('randomMealImage');
    const randomMealName = document.getElementById('randomMealName');

    // Fetch and display a random meal
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            const randomMeal = data.meals[0];
            randomMealImage.src = randomMeal.strMealThumb;
            randomMealName.textContent = randomMeal.strMeal;

            // Add a click event listener to the random meal image
            randomMealImage.addEventListener('click', () => showMealDetails(randomMeal.idMeal));
        })
        .catch(error => {
            console.error('Error fetching random meal:', error);
        });
}

// Function to fetch and display all meal categories
function getAllCategories() {
    const listElement = document.getElementById('allCategoriesList');

    // Fetch and display all categories
    fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
        .then(response => response.json())
        .then(data => {
            listElement.innerHTML = ''; // Clear existing categories
            let rowElement;

            data.categories.forEach((category, index) => {
                if (index % 3 === 0) {
                    // Create a new row for every three categories
                    rowElement = document.createElement('div');
                    rowElement.className = 'category-row';
                    listElement.appendChild(rowElement);
                }

                // Create li and img elements
                const liElement = document.createElement('li');
                const imgElement = document.createElement('img');

                // Set the image source and alt text
                imgElement.src = category.strCategoryThumb;
                imgElement.alt = category.strCategory;

                // Set the category name as text content
                liElement.textContent = category.strCategory;

                // Append the image and li elements to the row
                liElement.appendChild(imgElement);
                rowElement.appendChild(liElement);
            });
        })
        .catch(error => {
            console.error('Error fetching all categories:', error);
        });
}

// Initial setup when the window loads
window.onload = function () {
    getRandomMeal();
    getAllCategories();
};
