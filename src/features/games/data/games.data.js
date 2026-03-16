// Images
import memoryGameImage from "../assets/images/memory-game.jpg";

const games = [
  {
    id: "memory-game",
    name: "Xotira o'yini",
    image: memoryGameImage,
    url: "https://xotira-oyini-uz.netlify.app",
    description: "Xotira qobiliyatingizni oshiring",
  },
];

export const getGameById = (id) => games.find((game) => game.id == id);

export default games;
