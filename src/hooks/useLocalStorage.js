import { useState, useEffect } from 'react';

/**
 * A custom hook for persisting state in localStorage
 * @param {string} key - The key to store the value under in localStorage
 * @param {any} initialValue - The initial value to use if no value is found in localStorage
 * @returns {[any, Function]} A stateful value and a function to update it
 */
export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update local storage whenever storedValue changes
  useEffect(() => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = typeof storedValue === 'function' 
        ? storedValue(storedValue) 
        : storedValue;
      
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

/**
 * Get a value from localStorage
 * @param {string} key - The key to retrieve from localStorage
 * @param {any} defaultValue - The default value to return if the key doesn't exist
 * @returns {any} The parsed value from localStorage or the default value
 */
export const getLocalStorageValue = (key, defaultValue = null) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Set a value in localStorage
 * @param {string} key - The key to store the value under
 * @param {any} value - The value to store
 * @returns {boolean} Whether the operation was successful
 */
export const setLocalStorageValue = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Remove a value from localStorage
 * @param {string} key - The key to remove from localStorage
 * @returns {boolean} Whether the operation was successful
 */
export const removeLocalStorageValue = (key) => {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

export default useLocalStorage; 