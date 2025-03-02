import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Switch,
  Animated,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { MaterialIcons, MaterialCommunityIcons, Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Sample data for meal types
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

// Sample data for dietary preferences
const DIETARY_PREFERENCES = [
  { id: 'vegan', name: 'Vegan', icon: 'leaf' },
  { id: 'vegetarian', name: 'Vegetarian', icon: 'seedling' },
  { id: 'pescatarian', name: 'Pescatarian', icon: 'fish' },
  { id: 'keto', name: 'Keto', icon: 'drumstick-bite' },
  { id: 'paleo', name: 'Paleo', icon: 'apple-alt' },
  { id: 'gluten-free', name: 'Gluten-Free', icon: 'bread-slice' },
  { id: 'dairy-free', name: 'Dairy-Free', icon: 'cheese' },
  { id: 'low-carb', name: 'Low Carb', icon: 'carrot' },
];

// Sample data for health goals
const HEALTH_GOALS = [
  { id: 'weight-loss', name: 'Weight Loss', icon: 'weight' },
  { id: 'muscle-gain', name: 'Muscle Gain', icon: 'dumbbell' },
  { id: 'maintenance', name: 'Maintenance', icon: 'balance-scale' },
  { id: 'heart-health', name: 'Heart Health', icon: 'heart' },
];

// Allergies and restrictions
const ALLERGIES = [
  { id: 'nuts', name: 'Nuts' },
  { id: 'shellfish', name: 'Shellfish' },
  { id: 'eggs', name: 'Eggs' },
  { id: 'soy', name: 'Soy' },
  { id: 'wheat', name: 'Wheat' },
  { id: 'dairy', name: 'Dairy' },
];

// Sample data for meals based on dietary preferences
const SAMPLE_MEALS = {
  'weight-loss': {
    Breakfast: [
      {
        id: '1',
        name: 'Greek Yogurt with Berries',
        calories: 240,
        protein: 18,
        carbs: 30,
        fat: 5,
        image: 'https://api.a0.dev/assets/image?text=Greek%20yogurt%20with%20fresh%20berries%20and%20a%20drizzle%20of%20honey&aspect=16:9',
        ingredients: ['Greek yogurt', 'Mixed berries', 'Honey', 'Chia seeds'],
        instructions: 'Mix all ingredients in a bowl. Top with honey and chia seeds.',
      },
      {
        id: '2',
        name: 'Avocado Toast with Egg',
        calories: 320,
        protein: 15,
        carbs: 25,
        fat: 18,
        image: 'https://api.a0.dev/assets/image?text=Avocado%20toast%20with%20a%20fried%20egg%20on%20top%20and%20red%20pepper%20flakes&aspect=16:9',
        ingredients: ['Whole grain bread', 'Avocado', 'Egg', 'Salt', 'Pepper', 'Red pepper flakes'],
        instructions: 'Toast bread. Mash avocado and spread on toast. Top with fried egg and seasonings.',
      },
    ],
    Lunch: [
      {
        id: '3',
        name: 'Quinoa Salad Bowl',
        calories: 380,
        protein: 12,
        carbs: 45,
        fat: 16,
        image: 'https://api.a0.dev/assets/image?text=Quinoa%20salad%20bowl%20with%20colorful%20vegetables&aspect=16:9',
        ingredients: ['Quinoa', 'Cucumber', 'Cherry tomatoes', 'Red onion', 'Feta cheese', 'Olive oil', 'Lemon juice'],
        instructions: 'Cook quinoa according to package. Mix with chopped vegetables. Dress with olive oil and lemon juice.',
      },
    ],
    Dinner: [
      {
        id: '4',
        name: 'Grilled Salmon with Vegetables',
        calories: 420,
        protein: 35,
        carbs: 15,
        fat: 22,
        image: 'https://api.a0.dev/assets/image?text=Grilled%20salmon%20with%20roasted%20vegetables%20on%20a%20plate&aspect=16:9',
        ingredients: ['Salmon fillet', 'Asparagus', 'Bell peppers', 'Zucchini', 'Olive oil', 'Lemon', 'Garlic', 'Herbs'],
        instructions: 'Marinate salmon with lemon, garlic, and herbs. Grill until cooked through. Roast vegetables with olive oil.',
      },
    ],
    Snack: [
      {
        id: '5',
        name: 'Apple with Almond Butter',
        calories: 200,
        protein: 5,
        carbs: 25,
        fat: 10,
        image: 'https://api.a0.dev/assets/image?text=Sliced%20apple%20with%20almond%20butter&aspect=16:9',
        ingredients: ['Apple', 'Almond butter'],
        instructions: 'Slice apple and serve with almond butter for dipping.',
      },
    ],
  },
  'muscle-gain': {
    Breakfast: [
      {
        id: '6',
        name: 'Protein Pancakes',
        calories: 450,
        protein: 30,
        carbs: 40,
        fat: 15,
        image: 'https://api.a0.dev/assets/image?text=Stack%20of%20protein%20pancakes%20with%20banana%20slices%20and%20maple%20syrup&aspect=16:9',
        ingredients: ['Protein powder', 'Banana', 'Eggs', 'Oats', 'Maple syrup'],
        instructions: 'Blend all ingredients except syrup. Cook on a non-stick pan. Top with maple syrup.',
      },
    ],
    Lunch: [
      {
        id: '7',
        name: 'Chicken and Rice Bowl',
        calories: 550,
        protein: 40,
        carbs: 60,
        fat: 12,
        image: 'https://api.a0.dev/assets/image?text=Grilled%20chicken%20and%20rice%20bowl%20with%20vegetables&aspect=16:9',
        ingredients: ['Chicken breast', 'Brown rice', 'Broccoli', 'Sweet potato', 'Olive oil'],
        instructions: 'Grill chicken with seasonings. Cook rice according to package. Steam broccoli and roast sweet potatoes.',
      },
    ],
    Dinner: [
      {
        id: '8',
        name: 'Beef Stir Fry with Noodles',
        calories: 620,
        protein: 45,
        carbs: 55,
        fat: 20,
        image: 'https://api.a0.dev/assets/image?text=Beef%20stir%20fry%20with%20vegetables%20and%20noodles&aspect=16:9',
        ingredients: ['Lean beef strips', 'Rice noodles', 'Bell peppers', 'Snap peas', 'Carrots', 'Soy sauce', 'Ginger', 'Garlic'],
        instructions: 'Stir fry beef with garlic and ginger. Add vegetables until tender. Mix in cooked noodles and sauce.',
      },
    ],
    Snack: [
      {
        id: '9',
        name: 'Greek Yogurt Protein Bowl',
        calories: 300,
        protein: 25,
        carbs: 30,
        fat: 8,
        image: 'https://api.a0.dev/assets/image?text=Greek%20yogurt%20bowl%20with%20nuts%20and%20granola&aspect=16:9',
        ingredients: ['Greek yogurt', 'Protein powder', 'Granola', 'Nuts', 'Honey'],
        instructions: 'Mix yogurt with protein powder. Top with granola, nuts, and a drizzle of honey.',
      },
    ],
  },
  'maintenance': {
    Breakfast: [
      {
        id: '10',
        name: 'Oatmeal with Fruits and Nuts',
        calories: 350,
        protein: 12,
        carbs: 45,
        fat: 12,
        image: 'https://api.a0.dev/assets/image?text=Bowl%20of%20oatmeal%20with%20fruits%20and%20nuts&aspect=16:9',
        ingredients: ['Rolled oats', 'Milk', 'Banana', 'Berries', 'Walnuts', 'Honey'],
        instructions: 'Cook oats with milk. Top with sliced fruits, nuts, and a drizzle of honey.',
      },
    ],
    Lunch: [
      {
        id: '11',
        name: 'Mediterranean Wrap',
        calories: 420,
        protein: 20,
        carbs: 40,
        fat: 18,
        image: 'https://api.a0.dev/assets/image?text=Mediterranean%20wrap%20with%20hummus%20and%20vegetables&aspect=16:9',
        ingredients: ['Whole grain wrap', 'Hummus', 'Feta cheese', 'Cucumber', 'Tomato', 'Red onion', 'Olives', 'Lettuce'],
        instructions: 'Spread hummus on wrap. Add vegetables, cheese, and olives. Roll up and serve.',
      },
    ],
    Dinner: [
      {
        id: '12',
        name: 'Baked Cod with Quinoa',
        calories: 380,
        protein: 30,
        carbs: 35,
        fat: 10,
        image: 'https://api.a0.dev/assets/image?text=Baked%20cod%20fillet%20with%20quinoa%20and%20roasted%20vegetables&aspect=16:9',
        ingredients: ['Cod fillet', 'Quinoa', 'Lemon', 'Garlic', 'Cherry tomatoes', 'Zucchini', 'Olive oil', 'Herbs'],
        instructions: 'Bake cod with lemon, garlic, and herbs. Serve with cooked quinoa and roasted vegetables.',
      },
    ],
    Snack: [
      {
        id: '13',
        name: 'Hummus with Veggie Sticks',
        calories: 180,
        protein: 6,
        carbs: 20,
        fat: 8,
        image: 'https://api.a0.dev/assets/image?text=Hummus%20with%20carrot%20and%20cucumber%20sticks&aspect=16:9',
        ingredients: ['Hummus', 'Carrots', 'Cucumber', 'Bell peppers'],
        instructions: 'Slice vegetables into sticks. Serve with hummus for dipping.',
      },
    ],
  },
  'heart-health': {
    Breakfast: [
      {
        id: '14',
        name: 'Berry Smoothie Bowl',
        calories: 320,
        protein: 15,
        carbs: 50,
        fat: 8,
        image: 'https://api.a0.dev/assets/image?text=Smoothie%20bowl%20with%20mixed%20berries%20and%20toppings&aspect=16:9',
        ingredients: ['Mixed berries', 'Banana', 'Greek yogurt', 'Almond milk', 'Chia seeds', 'Granola'],
        instructions: 'Blend berries, banana, yogurt, and milk. Pour into bowl and top with seeds and granola.',
      },
    ],
    Lunch: [
      {
        id: '15',
        name: 'Heart-Healthy Grain Bowl',
        calories: 380,
        protein: 18,
        carbs: 45,
        fat: 14,
        image: 'https://api.a0.dev/assets/image?text=Grain%20bowl%20with%20salmon%20avocado%20and%20vegetables&aspect=16:9',
        ingredients: ['Brown rice', 'Salmon', 'Avocado', 'Spinach', 'Edamame', 'Carrots', 'Olive oil', 'Lemon juice'],
        instructions: 'Cook rice. Arrange salmon and vegetables in bowl. Drizzle with olive oil and lemon juice.',
      },
    ],
    Dinner: [
      {
        id: '16',
        name: 'Lentil Soup with Vegetables',
        calories: 310,
        protein: 18,
        carbs: 40,
        fat: 6,
        image: 'https://api.a0.dev/assets/image?text=Lentil%20soup%20with%20vegetables%20in%20a%20bowl&aspect=16:9',
        ingredients: ['Lentils', 'Carrots', 'Celery', 'Onion', 'Garlic', 'Tomatoes', 'Vegetable broth', 'Spices'],
        instructions: 'Sauté vegetables. Add lentils, tomatoes, and broth. Simmer until lentils are tender.',
      },
    ],
    Snack: [
      {
        id: '17',
        name: 'Walnuts and Dried Fruit Mix',
        calories: 200,
        protein: 5,
        carbs: 15,
        fat: 14,
        image: 'https://api.a0.dev/assets/image?text=Mix%20of%20walnuts%20and%20dried%20fruits&aspect=16:9',
        ingredients: ['Walnuts', 'Almonds', 'Dried apricots', 'Dried cranberries'],
        instructions: 'Mix all ingredients together for a heart-healthy snack.',
      },
    ],
  },
  'vegan': {
    Breakfast: [
      {
        id: '18',
        name: 'Vegan Overnight Oats',
        calories: 280,
        protein: 10,
        carbs: 45,
        fat: 8,
        image: 'https://api.a0.dev/assets/image?text=Overnight%20oats%20with%20plant%20milk%20and%20berries&aspect=16:9',
        ingredients: ['Rolled oats', 'Almond milk', 'Chia seeds', 'Maple syrup', 'Berries', 'Sliced almonds'],
        instructions: 'Mix oats, milk, and chia seeds. Refrigerate overnight. Top with berries and nuts.',
      },
    ],
    Lunch: [
      {
        id: '19',
        name: 'Buddha Bowl',
        calories: 420,
        protein: 15,
        carbs: 55,
        fat: 16,
        image: 'https://api.a0.dev/assets/image?text=Colorful%20vegan%20buddha%20bowl%20with%20vegetables%20and%20tofu&aspect=16:9',
        ingredients: ['Quinoa', 'Roasted sweet potato', 'Crispy tofu', 'Avocado', 'Kale', 'Tahini dressing'],
        instructions: 'Arrange all ingredients in a bowl. Drizzle with tahini dressing.',
      },
    ],
    Dinner: [
      {
        id: '20',
        name: 'Vegan Mushroom Risotto',
        calories: 380,
        protein: 10,
        carbs: 60,
        fat: 10,
        image: 'https://api.a0.dev/assets/image?text=Creamy%20mushroom%20risotto&aspect=16:9',
        ingredients: ['Arborio rice', 'Mixed mushrooms', 'Vegetable broth', 'Nutritional yeast', 'Onion', 'Garlic', 'Thyme'],
        instructions: 'Sauté mushrooms, onion, and garlic. Add rice and gradually add broth while stirring until creamy.',
      },
    ],
    Snack: [
      {
        id: '21',
        name: 'Energy Balls',
        calories: 180,
        protein: 5,
        carbs: 20,
        fat: 10,
        image: 'https://api.a0.dev/assets/image?text=Vegan%20energy%20balls%20with%20dates%20and%20nuts&aspect=16:9',
        ingredients: ['Dates', 'Oats', 'Almond butter', 'Chia seeds', 'Cocoa powder'],
        instructions: 'Blend dates. Mix with remaining ingredients. Form into balls and refrigerate.',
      },
    ],
  },
};

const MealPlannerApp = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [currentDay, setCurrentDay] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMealDetailModal, setShowMealDetailModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState('weight-loss');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completedMeals, setCompletedMeals] = useState([]);
  const [calorieTarget, setCalorieTarget] = useState(2000);
  const [waterTarget, setWaterTarget] = useState(8);
  const [waterIntake, setWaterIntake] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState({
    name: 'Guest',
    weight: 70,
    height: 170,
    age: 30,
    gender: 'Not specified',
  });

  // Animation value for progress circles
  const progressAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Generate a weekly meal plan when preferences change
    generateWeeklyPlan();
  }, [selectedGoal, selectedDiet]);

  // Generate a weekly meal plan based on preferences
  const generateWeeklyPlan = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      const weekPlan = daysOfWeek.map(day => {
        // Get meals based on selected goal or use default if not available
        const meals = SAMPLE_MEALS[selectedGoal] || SAMPLE_MEALS['weight-loss'];
        
        return {
          day,
          meals: {
            Breakfast: meals.Breakfast[Math.floor(Math.random() * meals.Breakfast.length)],
            Lunch: meals.Lunch[Math.floor(Math.random() * meals.Lunch.length)],
            Dinner: meals.Dinner[Math.floor(Math.random() * meals.Dinner.length)],
            Snack: meals.Snack[Math.floor(Math.random() * meals.Snack.length)],
          }
        };
      });
      
      setWeeklyPlan(weekPlan);
      setLoading(false);
    }, 1500);
  };

  // Toggle meal completion status
  const toggleMealCompletion = (meal) => {
    if (completedMeals.some(m => m.id === meal.id && m.day === currentDay)) {
      setCompletedMeals(completedMeals.filter(m => !(m.id === meal.id && m.day === currentDay)));
    } else {
      setCompletedMeals([...completedMeals, { ...meal, day: currentDay }]);
    }
  };

  // Toggle allergy selection
  const toggleAllergy = (allergyId) => {
    if (allergies.includes(allergyId)) {
      setAllergies(allergies.filter(id => id !== allergyId));
    } else {
      setAllergies([...allergies, allergyId]);
    }
  };

  // Calculate daily nutrition totals
  const calculateDailyNutrition = () => {
    if (!weeklyPlan[currentDay]) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    const dayMeals = Object.values(weeklyPlan[currentDay].meals);
    return dayMeals.reduce((total, meal) => {
      return {
        calories: total.calories + meal.calories,
        protein: total.protein + meal.protein,
        carbs: total.carbs + meal.carbs,
        fat: total.fat + meal.fat,
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  // Calculate progress percentage for nutrition
  const calculateProgress = (current, target) => {
    const progress = (current / target) * 100;
    return Math.min(progress, 100);
  };

  // Handle adding water
  const addWater = () => {
    if (waterIntake < waterTarget) {
      setWaterIntake(waterIntake + 1);
    }
  };

  // Handle water reset
  const resetWater = () => {
    setWaterIntake(0);
  };

  // View meal details
  const viewMealDetails = (meal) => {
    setSelectedMeal(meal);
    setShowMealDetailModal(true);
  };

  // Filtered meals based on search query
  const getFilteredMeals = () => {
    if (!weeklyPlan[currentDay]) return {};
    
    const dayMeals = weeklyPlan[currentDay].meals;
    if (!searchQuery) return dayMeals;
    
    const filtered = {};
    Object.keys(dayMeals).forEach(mealType => {
      if (dayMeals[mealType].name.toLowerCase().includes(searchQuery.toLowerCase())) {
        filtered[mealType] = dayMeals[mealType];
      }
    });
    
    return filtered;
  };

  // Home Tab Content
  const renderHomeTab = () => {
    const dailyNutrition = calculateDailyNutrition();
    const calorieProgress = calculateProgress(dailyNutrition.calories, calorieTarget);
    const waterProgress = calculateProgress(waterIntake, waterTarget);
    
    return (
      <ScrollView style={styles.tabContent}>
        {/* Today's Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          
          {weeklyPlan.length > 0 && (
            <Text style={styles.dayTitle}>{weeklyPlan[currentDay]?.day || 'Loading...'}</Text>
          )}
          
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressText}>{Math.round(calorieProgress)}%</Text>
                <Text style={styles.progressLabel}>Calories</Text>
              </View>
              <Text style={styles.statValue}>{dailyNutrition.calories} / {calorieTarget}</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressText}>{Math.round(waterProgress)}%</Text>
                <Text style={styles.progressLabel}>Water</Text>
              </View>
              <Text style={styles.statValue}>{waterIntake} / {waterTarget} glasses</Text>
              <View style={styles.waterControls}>
                <TouchableOpacity onPress={addWater} style={styles.waterButton}>
                  <MaterialIcons name="add" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={resetWater} style={[styles.waterButton, styles.resetButton]}>
                  <MaterialIcons name="refresh" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroValue}>{dailyNutrition.protein}g</Text>
              <View style={styles.macroBar}>
                <View style={[styles.macroProgress, { width: `${(dailyNutrition.protein / 100) * 100}%`, backgroundColor: '#FF6B6B' }]} />
              </View>
            </View>
            
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={styles.macroValue}>{dailyNutrition.carbs}g</Text>
              <View style={styles.macroBar}>
                <View style={[styles.macroProgress, { width: `${(dailyNutrition.carbs / 200) * 100}%`, backgroundColor: '#4ECDC4' }]} />
              </View>
            </View>
            
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Fat</Text>
              <Text style={styles.macroValue}>{dailyNutrition.fat}g</Text>
              <View style={styles.macroBar}>
                <View style={[styles.macroProgress, { width: `${(dailyNutrition.fat / 70) * 100}%`, backgroundColor: '#FFD166' }]} />
              </View>
            </View>
          </View>
        </View>
        
        {/* Today's Meals */}
        <View style={styles.mealsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            <TouchableOpacity onPress={generateWeeklyPlan} style={styles.refreshButton}>
              <MaterialIcons name="refresh" size={20} color="#4A6572" />
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>
          
          {/* Meal Type Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mealTypeScroll}>
            {MEAL_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.mealTypeTab,
                  selectedMealType === type && styles.activeMealTypeTab
                ]}
                onPress={() => setSelectedMealType(type)}
              >
                <Text
                  style={[
                    styles.mealTypeText,
                    selectedMealType === type && styles.activeMealTypeText
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Day Selection */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelectionScroll}>
            {weeklyPlan.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayTab,
                  currentDay === index && styles.activeDayTab
                ]}
                onPress={() => setCurrentDay(index)}
              >
                <Text style={[styles.dayTabDay, currentDay === index && styles.activeDayTabText]}>
                  {day.day.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Meal Cards */}
          {loading ? (
            <ActivityIndicator size="large" color="#4A6572" style={styles.loader} />
          ) : (
            weeklyPlan.length > 0 && Object.entries(getFilteredMeals()).map(([type, meal]) => {
              if (selectedMealType !== 'All' && type !== selectedMealType) return null;
              
              const isCompleted = completedMeals.some(m => m.id === meal.id && m.day === currentDay);
              
              return (
                <TouchableOpacity
                  key={meal.id}
                  style={[styles.mealCard, isCompleted && styles.completedMealCard]}
                  onPress={() => viewMealDetails(meal)}
                >
                  <Image source={{ uri: meal.image }} style={styles.mealImage} />
                  <View style={styles.mealInfo}>
                    <View style={styles.mealHeaderRow}>
                      <Text style={styles.mealType}>{type}</Text>
                      <TouchableOpacity onPress={() => toggleMealCompletion(meal)}>
                        <MaterialIcons
                          name={isCompleted ? "check-circle" : "radio-button-unchecked"}
                          size={24}
                          color={isCompleted ? "#4ECDC4" : "#ccc"}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <View style={styles.mealNutrition}>
                      <Text style={styles.nutritionItem}>{meal.calories} cal</Text>
                      <Text style={styles.nutritionItem}>{meal.protein}g protein</Text>
                      <Text style={styles.nutritionItem}>{meal.carbs}g carbs</Text>
                      <Text style={styles.nutritionItem}>{meal.fat}g fat</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    );
  };

  // Plan Tab Content
  const renderPlanTab = () => {
    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={24} color="#aaa" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search meals..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={24} color="#aaa" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.weekPlanContainer}>
          <Text style={styles.sectionTitle}>Weekly Meal Plan</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#4A6572" style={styles.loader} />
          ) : (
            weeklyPlan.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dayPlanCard}
                onPress={() => {
                  setCurrentDay(index);
                  setActiveTab('Home');
                }}
              >
                <Text style={styles.dayName}>{day.day}</Text>
                <View style={styles.dayMealsPreview}>
                  {Object.entries(day.meals).map(([type, meal]) => (
                    <View key={type} style={styles.dayMealPreview}>
                      <Text style={styles.dayMealType}>{type}</Text>
                      <Text style={styles.dayMealName} numberOfLines={1}>{meal.name}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.dayCardRight}>
                  <Text style={styles.dayCalories}>
                    {Object.values(day.meals).reduce((sum, meal) => sum + meal.calories, 0)} cal
                  </Text>
                  <MaterialIcons name="chevron-right" size={24} color="#4A6572" />
                </View>
              </TouchableOpacity>
            ))
          )}
          
          <TouchableOpacity style={styles.regenerateButton} onPress={generateWeeklyPlan}>
            <MaterialIcons name="refresh" size={20} color="#fff" />
            <Text style={styles.regenerateText}>Regenerate Meal Plan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  // Profile Tab Content
  const renderProfileTab = () => {
    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <MaterialIcons name="person" size={80} color="#fff" />
          </View>
          <Text style={styles.profileName}>{userProfile.name}</Text>
          
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => setShowProfileModal(true)}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.preferencesContainer}>
          <Text style={styles.sectionTitle}>My Health Goals</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.goalsScrollView}>
            {HEALTH_GOALS.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalCard,
                  selectedGoal === goal.id && styles.selectedGoalCard
                ]}
                onPress={() => setSelectedGoal(goal.id)}
              >
                <View style={styles.goalIconContainer}>
                  <FontAwesome5 name={goal.icon} size={24} color={selectedGoal === goal.id ? "#fff" : "#4A6572"} />
                </View>
                <Text style={[styles.goalText, selectedGoal === goal.id && styles.selectedGoalText]}>
                  {goal.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <Text style={styles.sectionTitle}>Dietary Preferences</Text>
          
          <View style={styles.dietaryGrid}>
            {DIETARY_PREFERENCES.map((diet) => (
              <TouchableOpacity
                key={diet.id}
                style={[
                  styles.dietaryCard,
                  selectedDiet === diet.id && styles.selectedDietaryCard
                ]}
                onPress={() => setSelectedDiet(diet.id === selectedDiet ? '' : diet.id)}
              >
                <FontAwesome5
                  name={diet.icon}
                  size={20}
                  color={selectedDiet === diet.id ? "#fff" : "#4A6572"}
                />
                <Text style={[styles.dietaryText, selectedDiet === diet.id && styles.selectedDietaryText]}>
                  {diet.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.sectionTitle}>Allergies & Restrictions</Text>
          
          <View style={styles.allergiesContainer}>
            {ALLERGIES.map((allergy) => (
              <TouchableOpacity
                key={allergy.id}
                style={styles.allergyItem}
                onPress={() => toggleAllergy(allergy.id)}
              >
                <View style={styles.allergyCheckbox}>
                  {allergies.includes(allergy.id) && (
                    <MaterialIcons name="check" size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.allergyText}>{allergy.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.sectionTitle}>Daily Targets</Text>
          
          <View style={styles.targetContainer}>
            <View style={styles.targetHeader}>
              <Text style={styles.targetLabel}>Daily Calories</Text>
              <Text style={styles.targetValue}>{calorieTarget} cal</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={1000}
              maximumValue={4000}
              step={50}
              value={calorieTarget}
              onValueChange={setCalorieTarget}
              minimumTrackTintColor="#4A6572"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#4A6572"
            />
          </View>
          
          <View style={styles.targetContainer}>
            <View style={styles.targetHeader}>
              <Text style={styles.targetLabel}>Daily Water Intake</Text>
              <Text style={styles.targetValue}>{waterTarget} glasses</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={4}
              maximumValue={16}
              step={1}
              value={waterTarget}
              onValueChange={setWaterTarget}
              minimumTrackTintColor="#4A6572"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#4A6572"
            />
          </View>
          
          <TouchableOpacity style={styles.savePrefsButton} onPress={generateWeeklyPlan}>
            <Text style={styles.savePrefsText}>Save & Generate Meal Plan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  // Render Profile Edit Modal
  const renderProfileModal = () => {
    return (
      <Modal visible={showProfileModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={userProfile.name}
                  onChangeText={(text) => setUserProfile({...userProfile, name: text})}
                  placeholder="Your name"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Age</Text>
                <TextInput
                  style={styles.input}
                  value={userProfile.age.toString()}
                  onChangeText={(text) => setUserProfile({...userProfile, age: parseInt(text) || 0})}
                  placeholder="Your age"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
                  <Text style={styles.inputLabel}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={userProfile.weight.toString()}
                    onChangeText={(text) => setUserProfile({...userProfile, weight: parseInt(text) || 0})}
                    placeholder="Weight in kg"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={[styles.inputGroup, {flex: 1, marginLeft: 8}]}>
                  <Text style={styles.inputLabel}>Height (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={userProfile.height.toString()}
                    onChangeText={(text) => setUserProfile({...userProfile, height: parseInt(text) || 0})}
                    placeholder="Height in cm"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Gender</Text>
                <View style={styles.genderOptions}>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      userProfile.gender === 'Male' && styles.selectedGenderOption
                    ]}
                    onPress={() => setUserProfile({...userProfile, gender: 'Male'})}
                  >
                    <Text style={[
                      styles.genderText,
                      userProfile.gender === 'Male' && styles.selectedGenderText
                    ]}>Male</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      userProfile.gender === 'Female' && styles.selectedGenderOption
                    ]}
                    onPress={() => setUserProfile({...userProfile, gender: 'Female'})}
                  >
                    <Text style={[
                      styles.genderText,
                      userProfile.gender === 'Female' && styles.selectedGenderText
                    ]}>Female</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      userProfile.gender === 'Other' && styles.selectedGenderOption
                    ]}
                    onPress={() => setUserProfile({...userProfile, gender: 'Other'})}
                  >
                    <Text style={[
                      styles.genderText,
                      userProfile.gender === 'Other' && styles.selectedGenderText
                    ]}>Other</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setShowProfileModal(false)}
            >
              <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  // Render Meal Detail Modal
  const renderMealDetailModal = () => {
    if (!selectedMeal) return null;
    
    return (
      <Modal visible={showMealDetailModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.mealDetailContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowMealDetailModal(false)}
            >
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            
            <ScrollView style={styles.mealDetailScroll}>
              <Image source={{ uri: selectedMeal.image }} style={styles.mealDetailImage} />
              
              <View style={styles.mealDetailContent}>
                <Text style={styles.mealDetailName}>{selectedMeal.name}</Text>
                
                <View style={styles.mealNutritionDetail}>
                  <View style={styles.nutritionDetailItem}>
                    <Text style={styles.nutritionDetailValue}>{selectedMeal.calories}</Text>
                    <Text style={styles.nutritionDetailLabel}>Calories</Text>
                  </View>
                  
                  <View style={styles.nutritionDetailItem}>
                    <Text style={styles.nutritionDetailValue}>{selectedMeal.protein}g</Text>
                    <Text style={styles.nutritionDetailLabel}>Protein</Text>
                  </View>
                  
                  <View style={styles.nutritionDetailItem}>
                    <Text style={styles.nutritionDetailValue}>{selectedMeal.carbs}g</Text>
                    <Text style={styles.nutritionDetailLabel}>Carbs</Text>
                  </View>
                  
                  <View style={styles.nutritionDetailItem}>
                    <Text style={styles.nutritionDetailValue}>{selectedMeal.fat}g</Text>
                    <Text style={styles.nutritionDetailLabel}>Fat</Text>
                  </View>
                </View>
                
                <View style={styles.mealIngredients}>
                  <Text style={styles.mealSectionTitle}>Ingredients</Text>
                  {selectedMeal.ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.ingredientItem}>
                      <MaterialIcons name="check" size={16} color="#4ECDC4" />
                      <Text style={styles.ingredientText}>{ingredient}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.mealInstructions}>
                  <Text style={styles.mealSectionTitle}>Instructions</Text>
                  <Text style={styles.instructionsText}>{selectedMeal.instructions}</Text>
                </View>
                
                <TouchableOpacity
                  style={styles.trackMealButton}
                  onPress={() => {
                    toggleMealCompletion(selectedMeal);
                    setShowMealDetailModal(false);
                  }}
                >
                  <Text style={styles.trackMealText}>
                    {completedMeals.some(m => m.id === selectedMeal.id && m.day === currentDay)
                      ? 'Untrack Meal'
                      : 'Track Meal'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* App Header */}
      <LinearGradient
        colors={['#4A6572', '#334653']}
        style={styles.header}
      >
        <Text style={styles.appTitle}>Meal Planner</Text>
        <TouchableOpacity onPress={() => setShowProfileModal(true)}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="person" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </LinearGradient>
      
      {/* Main Content */}
      <View style={styles.content}>
        {activeTab === 'Home' && renderHomeTab()}
        {activeTab === 'Plan' && renderPlanTab()}
        {activeTab === 'Profile' && renderProfileTab()}
      </View>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('Home')}
        >
          <MaterialIcons
            name="home"
            size={24}
            color={activeTab === 'Home' ? '#4A6572' : '#888'}
          />
          <Text style={[styles.navText, activeTab === 'Home' && styles.activeNavText]}>
            Home
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('Plan')}
        >
          <MaterialIcons
            name="calendar-today"
            size={24}
            color={activeTab === 'Plan' ? '#4A6572' : '#888'}
          />
          <Text style={[styles.navText, activeTab === 'Plan' && styles.activeNavText]}>
            Plan
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('Profile')}
        >
          <MaterialIcons
            name="person"
            size={24}
            color={activeTab === 'Profile' ? '#4A6572' : '#888'}
          />
          <Text style={[styles.navText, activeTab === 'Profile' && styles.activeNavText]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Modals */}
      {renderProfileModal()}
      {renderMealDetailModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#888',
  },
  activeNavText: {
    color: '#4A6572',
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A6572',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A6572',
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    color: '#666',
  },
  waterControls: {
    flexDirection: 'row',
    marginTop: 8,
  },
  waterButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 4,
    padding: 4,
    marginHorizontal: 4,
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
  },
  macrosContainer: {
    marginTop: 8,
  },
  macroItem: {
    marginBottom: 12,
  },
  macroLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  macroBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  macroProgress: {
    height: '100%',
    borderRadius: 4,
  },
  mealsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshText: {
    fontSize: 14,
    color: '#4A6572',
    marginLeft: 4,
  },
  mealTypeScroll: {
    marginBottom: 16,
  },
  mealTypeTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeMealTypeTab: {
    backgroundColor: '#4A6572',
  },
  mealTypeText: {
    fontSize: 14,
    color: '#666',
  },
  activeMealTypeText: {
    color: '#fff',
    fontWeight: '500',
  },
  daySelectionScroll: {
    marginBottom: 16,
  },
  dayTab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activeDayTab: {
    backgroundColor: '#4A6572',
  },
  dayTabDay: {
    fontSize: 14,
    color: '#666',
  },
  activeDayTabText: {
    color: '#fff',
    fontWeight: '500',
  },
  loader: {
    marginVertical: 20,
  },
  mealCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  completedMealCard: {
    opacity: 0.7,
  },
  mealImage: {
    width: 100,
    height: 100,
  },
  mealInfo: {
    flex: 1,
    padding: 12,
  },
  mealHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mealType: {
    fontSize: 12,
    color: '#4A6572',
    fontWeight: '500',
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mealNutrition: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  nutritionItem: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
    marginBottom: 4,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  weekPlanContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayPlanCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  dayName: {
    width: 80,
    fontSize: 14,
    fontWeight: '500',
    color: '#4A6572',
  },
  dayMealsPreview: {
    flex: 1,
  },
  dayMealPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayMealType: {
    width: 70,
    fontSize: 12,
    color: '#666',
  },
  dayMealName: {
    flex: 1,
    fontSize: 12,
    color: '#333',
  },
  dayCardRight: {
    alignItems: 'flex-end',
  },
  dayCalories: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  regenerateButton: {
    backgroundColor: '#4A6572',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  regenerateText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 8,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4A6572',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: 14,
    color: '#4A6572',
    fontWeight: '500',
  },
  preferencesContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalsScrollView: {
    marginBottom: 24,
  },
  goalCard: {
    width: 120,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
  },
  selectedGoalCard: {
    backgroundColor: '#4A6572',
  },
  goalIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  goalText: {
    fontSize: 14,
    color: '#4A6572',
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedGoalText: {
    color: '#fff',
  },
  dietaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  dietaryCard: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    margin: '1.5%',
  },
  selectedDietaryCard: {
    backgroundColor: '#4A6572',
  },
  dietaryText: {
    fontSize: 12,
    color: '#4A6572',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  selectedDietaryText: {
    color: '#fff',
  },
  allergiesContainer: {
    marginBottom: 24,
  },
  allergyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  allergyCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#4A6572',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  allergyText: {
    fontSize: 16,
    color: '#333',
  },
  targetContainer: {
    marginBottom: 16,
  },
  targetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  targetLabel: {
    fontSize: 16,
    color: '#333',
  },
  targetValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A6572',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  savePrefsButton: {
    backgroundColor: '#4A6572',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  savePrefsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 16,
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedGenderOption: {
    backgroundColor: '#4A6572',
  },
  genderText: {
    fontSize: 14,
    color: '#666',
  },
  selectedGenderText: {
    color: '#fff',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4A6572',
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealDetailContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealDetailScroll: {
    maxHeight: '90%',
  },
  mealDetailImage: {
    width: '100%',
    height: 200,
  },
  mealDetailContent: {
    padding: 16,
  },
  mealDetailName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  mealNutritionDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  nutritionDetailItem: {
    alignItems: 'center',
  },
  nutritionDetailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A6572',
  },
  nutritionDetailLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  mealIngredients: {
    marginBottom: 16,
  },
  mealSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 16,
    marginLeft: 8,
  },
  mealInstructions: {
    marginBottom: 20,
  },
  instructionsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  trackMealButton: {
    backgroundColor: '#4A6572',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  trackMealText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MealPlannerApp;