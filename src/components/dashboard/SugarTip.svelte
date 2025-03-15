<script>
  export let totalSugar = 0;
  export let sugarGoal = 25;
  
  // Tips based on consumption level
  $: sugarPercent = Math.round((totalSugar / sugarGoal) * 100);
  $: tips = [
    {
      threshold: 0,
      title: "Starting Fresh",
      text: "Track your sugar intake throughout the day for better health awareness.",
      icon: "✓"
    },
    {
      threshold: 50,
      title: "On Track",
      text: "You're doing well! Remember to choose whole foods over processed options.",
      icon: "🍎"
    },
    {
      threshold: 80,
      title: "Almost There",
      text: "Be mindful of hidden sugars in sauces and beverages as you approach your limit.",
      icon: "⚠️"
    },
    {
      threshold: 100,
      title: "Limit Reached",
      text: "You've reached your sugar goal for today. Try to avoid additional sugary foods.",
      icon: "🛑"
    },
    {
      threshold: 125,
      title: "Over Limit",
      text: "Consider drinking extra water and focusing on protein and fiber for remaining meals.",
      icon: "⚠️"
    }
  ];
  
  // Get the appropriate tip based on current consumption
  $: currentTip = tips.filter(tip => sugarPercent >= tip.threshold).pop();
  
  // Random health facts about sugar
  const sugarFacts = [
    "The American Heart Association recommends no more than 25g of added sugar daily for women and 36g for men.",
    "Excess sugar consumption has been linked to increased risk of type 2 diabetes.",
    "Sugar can hide under many names on food labels, including sucrose, fructose, and maltose.",
    "Fruit contains natural sugars but also provides fiber, vitamins, and minerals.",
    "Drinking water instead of sugary beverages can significantly reduce your sugar intake.",
    "The average American consumes about 17 teaspoons of added sugar per day.",
    "Sugar can affect brain chemistry and contribute to cravings for more sweet foods.",
    "Many condiments like ketchup and barbecue sauce contain surprising amounts of sugar.",
    "Reducing sugar intake may help improve skin clarity and overall appearance."
  ];
  
  // Randomly select a fact to display
  $: randomFact = sugarFacts[Math.floor(Math.random() * sugarFacts.length)];
</script>

<div class="overflow-hidden rounded-xl bg-white shadow-md">
  <div class="bg-gradient-to-r from-green-500 to-teal-500 px-4 py-3 md:px-6 md:py-4">
    <h3 class="flex items-center text-base font-medium text-white md:text-lg">
      <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Sugar Tips
    </h3>
  </div>
  
  <div class="p-4 md:p-6">
    <!-- Sugar consumption card -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <div class="flex items-center">
          <span class="text-2xl font-bold">{totalSugar}g</span>
          <span class="ml-1 text-sm text-gray-500">of {sugarGoal}g</span>
        </div>
        <p class="text-xs text-gray-500 mt-0.5">Sugar consumed today</p>
      </div>
      
      <div class="relative h-16 w-16 rounded-full bg-gray-100">
        <div class="absolute inset-1 rounded-full bg-white flex items-center justify-center">
          <span
            class={`text-xl ${
              sugarPercent >= 100
                ? 'text-red-600'
                : sugarPercent >= 80
                  ? 'text-orange-500'
                  : 'text-green-600'
            }`}
          >
            {currentTip?.icon}
          </span>
        </div>
        <svg
          viewBox="0 0 36 36"
          class="absolute inset-0 h-full w-full stroke-current"
          style={`stroke: ${
            sugarPercent >= 100 ? '#DC2626' : sugarPercent >= 80 ? '#F97316' : '#10B981'
          }; stroke-dasharray: ${sugarPercent}, 100; transform: rotate(-90deg); transform-origin: center;`}
        >
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke-width="2"
            stroke-linecap="round"
            class="transform origin-center -rotate-90"
          ></circle>
        </svg>
      </div>
    </div>
    
    <!-- Current tip based on consumption -->
    <div 
      class={`mb-4 rounded-lg p-3 ${
        sugarPercent >= 100
          ? 'bg-red-50 text-red-800'
          : sugarPercent >= 80
            ? 'bg-yellow-50 text-yellow-800'
            : 'bg-green-50 text-green-800'
      }`}
    >
      <p class="font-medium">{currentTip?.title}</p>
      <p class="mt-1 text-sm">{currentTip?.text}</p>
    </div>
    
    <!-- Random sugar fact -->
    <div class="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
      <p class="font-medium mb-1">Did you know?</p>
      <p>{randomFact}</p>
    </div>
  </div>
</div>
