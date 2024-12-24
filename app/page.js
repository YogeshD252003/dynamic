"use client";
import { useState } from "react";
import Tesseract from "tesseract.js";
import axios from "axios";
import "tailwindcss/tailwind.css"
import "@/app/globals.css"

export default function Home() {
  const [image, setImage] = useState(null);
  const [fetchedText, setFetchedText] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dishImages, setDishImages] = useState([]); // Store fetched images

  // Static List of Dish Names
  const dishList = [
    "butter chicken", "chicken tikka", "tandoori chicken", "aloo paratha", "chole bhature", "palak paneer",
    "rajma", "sarson da saag", "methi thepla", "kadhi pakora", "dal makhani", "paneer butter masala",
    "shahi paneer", "lassi", "gulab jamun", "chana masala", "tandoori roti", "naan", "dum aloo", "keema naan",
    "rogan josh", "seekh kebab", "shami kebab", "galouti kebab", "dosa", "idli", "vada", "sambar", "rasam",
    "pongal", "uttapam", "hyderabadi biryani", "chettinad chicken curry", "kerala sadya", "appam",
    "fish curry", "avial", "thoran", "kootu", "mysore pak", "rava kesari", "malabar parotta", "kozhukattai",
    "banana chips", "puttu", "sadya", "pav bhaji", "vada pav", "dhokla", "thepla", "khakra", "undhiyu",
    "puran poli", "goan fish curry", "prawn balchao", "feni", "sev puri", "bhel puri", "misal pav", "dal dhokli",
    "rava upma", "bombil fry", "khaman dhokla", "shrikanth", "baida roti", "macher jhol", "shorshe ilish",
    "litti chokha", "momos", "chingri malai curry", "rasgulla", "sandesh", "chingri bhorta", "kheer",
    "pakhala bhata", "poha", "bhutte ka kees", "dal bafla", "samosa", "jalebi", "daal baati churma",
    "shahi tukda", "kachori", "pani puri", "golgappa", "sevpuri", "dahi puri", "aloo tikki", "besan laddu",
    "motichoor laddu", "barfi", "kaju katli", "laddu", "sandesh", "rabri", "saffron milk cake", "biryani",
    "pulav", "lemon rice", "coconut rice", "tomato rice", "tamarind rice", "pulao", "khichdi", "zafrani pulao",
    "vegetable biryani", "cabbage rice", "curd rice", "sambhar rice", "naan", "roti", "chapati", "paratha",
    "tandoori roti", "lachha paratha", "roomali roti", "bhakri", "makki di roti", "stuffed paratha", "masala chai",
    "lassi", "jaljeera", "buttermilk", "thandai", "sugarcane juice", "nimbu pani", "chaas", "sweet lime soda",
    "coconut water", "feni", "fruity drinks", "mango lassi", "guava lassi"
  ];

  // Function to fetch an image URL for a dish from Unsplash with food-related filters
  // const fetchDishImage = async (dish) => {
  //   try {
  //     const response = await axios.get(`https://api.unsplash.com/search/photos`, {
  //       params: {
  //         query: dish, // Adding 'food' to the search query for more specific results
  //         client_id: 'MtjYAYT8Sar-Foawc2t7_B9VKJErMpfzDGohXeH215E', // Replace with your Unsplash Access Key
  //         per_page: 1
  //       }
  //     });
  //     if (response.data.results.length > 0) {
  //       const imageUrl = response.data.results[0].urls.small;
  //       const description = response.data.results[0].description || '';

  //       // Optional: Check if the description or alt_text contains keywords related to food
  //     }
  //   } catch (error) {
  //     console.error("Error fetching dish image:", error);
  //   }
  //   return 'https://via.placeholder.com/150'; // Default placeholder if image not found
  // };
  const fetchDishImage = async (dish) => {
    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: {
          query: dish,
          client_id: 'MtjYAYT8Sar-Foawc2t7_B9VKJErMpfzDGohXeH215E', // Replace with your Unsplash Access Key
          per_page: 1
        }
      });
      if (response.data.results.length > 0) {
        return response.data.results[0].urls.small; // Fetch the first image
      }
    } catch (error) {
      console.error("Error fetching dish image:", error);
    }
    return 'https://via.placeholder.com/150'; // Default placeholder if image not found
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setFetchedText([]); // Reset the text when a new image is uploaded
    }
  };

  // Function to sanitize text and keep only alphabets and spaces
  const sanitizeText = (text) => {
    return text.replace(/[^a-zA-Z\s]/g, ""); // Remove anything that is not a letter or space
  };

  // Function to extract dish names from text
  const extractDishNames = (text) => {
    const sanitizedText = sanitizeText(text); // Sanitize the text
    const words = sanitizedText.toLowerCase().split(/\s+/); // Split text into words
    const matchedDishes = [];

    // Check if any dish name contains the extracted words
    dishList.forEach(dish => {
      const dishWords = dish.toLowerCase().split(" ");
      for (let word of words) {
        if (dishWords.includes(word)) {
          matchedDishes.push(dish);
          break; // If one word matches, add the dish and stop checking other words
        }
      }
    });

    return matchedDishes.length > 0 ? matchedDishes : ["No dish found"]; // Return matched dishes as an array
  };

  // Handle text fetching from image using Tesseract.js
  const handleFetchText = () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    setLoading(true); // Show loading state

    Tesseract.recognize(
      image, // The uploaded image file
      "eng",  // Language for OCR
      {
        logger: (m) => console.log(m), // Log OCR progress
      }
    )
      .then(async ({ data: { text } }) => {
        const dishNames = extractDishNames(text); // Extract dish names from the text
        setFetchedText(dishNames); // Set the extracted dish names

        // Fetch images for each dish
        const images = await Promise.all(dishNames.map(dish => fetchDishImage(dish)));
        setDishImages(images); // Set the fetched images

        setLoading(false); // Hide loading state
      })
      .catch((err) => {
        console.error("Error during OCR:", err);
        setFetchedText(["Error fetching text."]);
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white font-sans">
      <h1 className="text-8xl text-white font-bold mb-3">Welcome to DynamicApp</h1>
      <p id="text" className="mt-0 text-3xl text-white text-opacity-50">where you can get your dishes ready</p>


      <div className="bg-blue-800 mt-10 border border-black w-lg rounded-lg text-center shadow-lg">

        <label
          htmlFor="file-upload"
          className="flex items-center justify-center p-4 rounded-lg bg-white text-black shadow-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition ease-in-out duration-300 w-full max-w-md mx-auto"
        >
          {/* File Upload SVG Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Click to upload</span>
        </label>

        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {image && (
          <>
            <button
              onClick={handleFetchText}
              className="p-3 rounded-lg bg-white text-blue-800 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Fetching..." : "Convert"}
            </button>

            <div className="mt-6">
              <div className="grid grid-cols-2 gap-6 justify-items-center">
                {fetchedText.map((dish, index) => (
                  <div key={index} className="flex flex-col items-center w-full">
                    <div
                      className="w-24 h-24 bg-cover mb-2"
                      style={{ backgroundImage: `url(${dishImages[index]})` }}
                    ></div>
                    <p className="text-white">{dish}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
