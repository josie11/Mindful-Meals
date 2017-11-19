
/**
 * Represents form used to create/edit logs, passed to components for building a new log.
*/
export interface FormObject {
  time: string;
  date: string;
  hungerLevelBefore: number;
  intensityLevel: number;
  triggerDescription?: string;
  mealType: string;
  completed: number;
  satisfactionLevel?: number;
  hungerLevelAfter?: number;
  mealDescription?: string;
};

/**
 * Represents form used to submit craving to database
*/
export interface CravingForm {
  cravingTime: string;
  cravingDate: string;
  hungerLevel: number;
  intensityLevel: number;
  triggerDescription?: string;
};

/**
 * Represents form used to before Meal to database
*/
export interface BeforeMealForm {
  mealTime: string;
  mealDate: string;
  hungerLevelBefore: number;
  intensityLevel: number;
  triggerDescription?: string;
  mealType: string;
  completed: number;
};

/**
 * Represents form used to submit a complete meal to database
*/
export interface CompleteMealForm {
  mealTime: string;
  mealDate: string;
  hungerLevelBefore: number;
  hungerLevelAfter: number;
  intensityLevel: number;
  satisfactionLevel: number;
  triggerDescription?: string;
  mealDescription?: string;
  mealType: string;
  completed: number;
};

/**
 * Represents a meal retrieved and formatted from database
*/
export interface Meal {
  id: number;
  date: string;
  mealTime: string;
  mealDate: string;
  hungerLevelBefore: number;
  hungerLevelAfter?: number;
  intensityLevel: number;
  satisfactionLevel?: number;
  triggerDescription?: string;
  mealDescription?: string;
  mealType: string;
  completed: number;
  beforeEmotions: object[];
  afterEmotions: object[];
  beforeFoods: object[];
  afterFoods: object[];
  distractions: object[];
};

/**
 * Represents a craving retrieved and formatted from database
*/
export interface Craving {
  id: number;
  date: string;
  cravingTime: string;
  cravingDate: string;
  hungerLevel: number;
  intensityLevel: number;
  triggerDescription?: string;
  emotions: object[];
  foods: object[];
};

/**
 * Represents a craving formatted to be used in log view
*/
export interface LogCraving {
  id: number;
  date: string;
  cravingTime: string;
  cravingDate: string;
  hungerLevel: number;
  intensityLevel: number;
  triggerDescription?: string;
  emotions: object;
  foods: object;
}

/**
 * Represents a meal formatted to be used in log view
*/
export interface LogMeal {
  id: number;
  date: string;
  mealTime: string;
  mealDate: string;
  hungerLevelBefore: number;
  hungerLevelAfter?: number;
  intensityLevel: number;
  satisfactionLevel?: number;
  triggerDescription?: string;
  mealDescription?: string;
  mealType: string;
  completed: number;
  beforeEmotions: object;
  afterEmotions: object;
  beforeFoods: object;
  afterFoods: object;
  distractions: object;
};

export interface DeletedCravingData {
  id: number;
  cravingDate: string;
}

export interface DeletedMealData {
  id: number;
  mealDate: string;
}
