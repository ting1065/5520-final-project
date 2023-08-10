const apiKey = "YwOeZg9Bxm3mkLE0TV2pf9bdDYxUewaCfIrK4Ai9"

//get random image from NASA API
export async function getRandomImageFromNASA() {
    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?count=1&api_key=${apiKey}`)
        
        if (!response.ok) {
            throw new Error(`Error while fetching data from NASA API. Status: ${response.status}`)
        }

        const data = await response.json();
        let imageUri = data[0].url;
        if (!imageUri.endsWith("jpg")) {
            imageUri = await getRandomImageFromNASA();
        }
        
        return imageUri;

    } catch (e) {
        console.error("Error happened while fetching data from NASA API: ", e);
    }
}