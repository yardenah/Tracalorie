class CalorieTracker {
    constructor() {
        this._calorieLimit = 2000;
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];

        this._displayCalorieLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }

    // Public Methods/API //

    addMeal (meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        this._displayNewItem(meal, 'meal');
        this._render();
    }

    addWorkout (workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        this._displayNewItem(workout, 'workout');
        this._render();
    }

    // Private Methods //

    _displayCaloriesTotal() {
        const totalCaloriesEl = document.getElementById('calories-total');
        totalCaloriesEl.innerHTML = this._totalCalories;
    }

    _displayCalorieLimit() {
        const calorieLimitEl = document.getElementById('calories-limit');
        calorieLimitEl.innerHTML = this._calorieLimit;
    }

    _displayCaloriesConsumed() {
        const caloriesConsumedEl = document.getElementById('calories-consumed');

        const consumed = this._meals.reduce((total, meal) => total + meal.calories, 0);

        caloriesConsumedEl.innerHTML = consumed;
    }

    _displayCaloriesBurned() {
        const caloriesBurnedEl = document.getElementById('calories-burned');

        const burned = this._workouts.reduce((total, workout) => total + workout.calories, 0);

        caloriesBurnedEl.innerHTML = burned;
    }

    _displayCaloriesRemaining() {
        const caloriesRemainingEl = document.getElementById('calories-remaining');

        const progressEl = document.getElementById('calorie-progress');

        const remaining = this._calorieLimit - this._totalCalories;

        caloriesRemainingEl.innerHTML = remaining;

        if (remaining <= 0) {
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger');
            progressEl.classList.remove('bg-sucess');
            progressEl.classList.add('bg-danger');
        } else {
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
            progressEl.classList.remove('bg-damger');
            progressEl.classList.add('bg-success');
        }
    }

    _displayCaloriesProgress() {
        const caloriesProgressEl = document.getElementById('calorie-progress');
        const percentage = (this._totalCalories / this._calorieLimit) * 100;
        const width = Math.min(percentage, 100);
        caloriesProgressEl.style.width = `${width}%`;
    }

    _displayNewItem(item, type) {
        const itemsEl = document.getElementById(`${type}-items`);
        const itemEl= document.createElement('div');
        itemEl.classList.add('card', 'my-2');
        itemEl.setAttribute('data-id',item.id)
        itemEl.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${item.name}</h4>
                  <div
                    class="fs-1 text-white text-center rounded-2 px-2 px-sm-5 bg-${type === 'workout' ? 'secondary' : 'primary'}"
                  >
                    ${item.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
        `;
        itemsEl.appendChild(itemEl);
    }

    _render() {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }
}

class Meal {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class App {
    constructor() {
        this._tracker = new CalorieTracker();

        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this,'meal'));
        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this,'workout'));
    }

    _newItem(type, e) {
        e.preventDefault();

        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);

        // Validate inputs
        if (name.value === '' || calories.value ===''){
            alert('Please fill in all fields');
            return;
        }

        if (type === 'meal'){
            const meal = new Meal(name.value, +calories.value);
            this._tracker.addMeal(meal);
        } else {
            const workout = new Workout(name.value, +calories.value);
            this._tracker.addWorkout(workout);
        }
        
        name.value = '';
        calories.value = '';

        const collapseItem = document.getElementById(`collapse-${type}`);
        const bsCollapse = new bootstrap.Collapse(collapseItem,{
            toggle: true
        });
    }
}

const app = new App();
