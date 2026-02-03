import { useState } from "react";
import axios from "axios";

const OutfitGenerator = () => {
  const [outfit, setOutfit] = useState(null);

  const generateOutfit = async () => {
    const res = await axios.post("http://localhost:4000/api/outfit/generate", {
      occasion: "party",
    });

    setOutfit(res.data.outfit);
  };

  return (
    <div className="p-10 text-center">
      <h2 className="text-2xl font-bold mb-5">
        👕 AI Outfit Generator
      </h2>

      <button
        onClick={generateOutfit}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Generate Party Outfit ✨
      </button>

      {outfit && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {Object.values(outfit).map(
            (item, index) =>
              item && (
                <div
                  key={index}
                  className="border p-4 rounded shadow"
                >
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="h-40 mx-auto"
                  />
                  <h3 className="font-semibold mt-3">
                    {item.name}
                  </h3>
                  <p>₹{item.price}</p>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default OutfitGenerator;
