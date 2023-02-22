import { FermentableType } from "../types/shared";

interface Defaultgrain {
  name: string;
  lovibond: number;
  gravity: number;
  type: FermentableType;
}

// came from homebrewacademy.com
const allMalts: Defaultgrain[] = [
  { name: "Acid Malt", lovibond: 3, gravity: 1.027, type: "grain" },
  { name: "Acidulated (Weyermann)", lovibond: 1, gravity: 1.03, type: "grain" },
  { name: "Acidulated (BestMalz)", lovibond: 1, gravity: 1.036, type: "grain" },
  { name: "Amber (Crisp)", lovibond: 27, gravity: 1.03, type: "grain" },
  {
    name: "Amber dry_extract",
    lovibond: 12,
    gravity: 1.044,
    type: "dry_extract",
  },
  {
    name: "Amber Liquid Extract",
    lovibond: 12,
    gravity: 1.036,
    type: "dry_extract",
  },
  { name: "Amber Malt", lovibond: 22, gravity: 1.035, type: "grain" },
  {
    name: "Amber Malt (Joe White)",
    lovibond: 23,
    gravity: 1.037,
    type: "grain",
  },
  {
    name: "Amber Malt Extract (Coopers)",
    lovibond: 172,
    gravity: 1.036,
    type: "dry_extract",
  },
  {
    name: "Aromatic Malt (Briess)",
    lovibond: 20,
    gravity: 1.035,
    type: "grain",
  },
  {
    name: "Aromatic Malt (Dingemans)",
    lovibond: 19,
    gravity: 1.037,
    type: "grain",
  },
  {
    name: "Australian Bitter Extract (Coopers)",
    lovibond: 35,
    gravity: 1.037,
    type: "dry_extract",
  },
  {
    name: "Australian Pale Ale Extract (Coopers)",
    lovibond: 45,
    gravity: 1.036,
    type: "dry_extract",
  },
  { name: "Aromatic Malt", lovibond: 26, gravity: 1.036, type: "grain" },
  { name: "Barley Hulls", lovibond: 0, gravity: 1, type: "grain" },
  { name: "Barley Flaked", lovibond: 1, gravity: 1.032, type: "grain" },
  {
    name: "Barley Flaked (Briess)",
    lovibond: 1,
    gravity: 1.035,
    type: "grain",
  },
  {
    name: "Barley Flaked (Thomas Fawcett)",
    lovibond: 2,
    gravity: 1.035,
    type: "grain",
  },
  { name: "Barley Raw", lovibond: 2, gravity: 1.028, type: "grain" },
  { name: "Barley Roasted", lovibond: 300, gravity: 1.025, type: "grain" },
  { name: "Barley Torrefied", lovibond: 1, gravity: 1.036, type: "grain" },
  { name: "Bayer", lovibond: 7, gravity: 1.036, type: "grain" },
  {
    name: "BestMälz Aromatic (BestMälz)",
    lovibond: 33,
    gravity: 1.033,
    type: "grain",
  },
  { name: "Biscuit (Dingemans)", lovibond: 22, gravity: 1.032, type: "grain" },
  {
    name: "Belgian Debittered Black Malt",
    lovibond: 550,
    gravity: 1.01,
    type: "grain",
  },
  { name: "Biscuit Malt", lovibond: 23, gravity: 1.036, type: "grain" },
  { name: "Black (Crisp)", lovibond: 680, gravity: 1.035, type: "grain" },
  { name: "Black (Patent) Malt", lovibond: 500, gravity: 1.025, type: "grain" },
  {
    name: "Black Barley (Briess)",
    lovibond: 500,
    gravity: 1.032,
    type: "grain",
  },
  {
    name: "Black Barley (Stout)",
    lovibond: 500,
    gravity: 1.025,
    type: "grain",
  },
  {
    name: "Black Malt (hoepfner)",
    lovibond: 600,
    gravity: 1.035,
    type: "grain",
  },
  {
    name: "Black Malt (Simpsons)",
    lovibond: 550,
    gravity: 1.025,
    type: "grain",
  },
  {
    name: "Black Malt (Thomas Fawcett)",
    lovibond: 660,
    gravity: 1.034,
    type: "grain",
  },
  {
    name: "Black Malt - 2 Row (Briess)",
    lovibond: 500,
    gravity: 1.033,
    type: "grain",
  },
  {
    name: "Black Malt - 6 Row (Briess)",
    lovibond: 500,
    gravity: 1.032,
    type: "grain",
  },
  {
    name: "Black Malt Extra (BestMälz)",
    lovibond: 710,
    gravity: 1.033,
    type: "grain",
  },
  {
    name: "Black Malt R1000 (BestMälz)",
    lovibond: 362,
    gravity: 1.033,
    type: "grain",
  },
  {
    name: "Black Malt R1400 (BestMälz)",
    lovibond: 710,
    gravity: 1.033,
    type: "grain",
  },
  { name: "Black Pearl Malt Dark", lovibond: 490, gravity: 1.3, type: "grain" },
  {
    name: "Black Pearl Malt Light",
    lovibond: 340,
    gravity: 1.3,
    type: "grain",
  },
  {
    name: "Black Pearl Malt Medium",
    lovibond: 420,
    gravity: 1.3,
    type: "grain",
  },
  {
    name: "Borlander Munich Malt (Briess)",
    lovibond: 10,
    gravity: 1.035,
    type: "grain",
  },
  { name: "Brewer's Malt 2-Row", lovibond: 1, gravity: 1.036, type: "grain" },
  {
    name: "Brewers Malt 2-Row (Briess)",
    lovibond: 1,
    gravity: 1.037,
    type: "grain",
  },
  {
    name: "Brewers Malt 6-Row (Briess)",
    lovibond: 1,
    gravity: 1.036,
    type: "grain",
  },
  { name: "Brown Malt", lovibond: 65, gravity: 1.032, type: "grain" },
  { name: "Brown Malt (Crisp)", lovibond: 65, gravity: 1.035, type: "grain" },
  {
    name: "Brown Malt (Simpsons)",
    lovibond: 150,
    gravity: 1.034,
    type: "grain",
  },
  {
    name: "Brown Malt Patagonia",
    lovibond: 115,
    gravity: 1.032,
    type: "grain",
  },
  { name: "Brown Sugar Dark", lovibond: 50, gravity: 1.046, type: "grain" },
  { name: "Brown Sugar Light", lovibond: 50, gravity: 1.046, type: "grain" },
  { name: "Brumalt", lovibond: 23, gravity: 1.033, type: "grain" },
  { name: "Cara-Pils/DeTRUEtrine", lovibond: 2, gravity: 1.033, type: "grain" },
  { name: "Caraamber", lovibond: 30, gravity: 1.035, type: "grain" },
  { name: "Caraaroma", lovibond: 130, gravity: 1.035, type: "grain" },
  { name: "Carafa I", lovibond: 337, gravity: 1.032, type: "grain" },
  { name: "Carafa II", lovibond: 412, gravity: 1.032, type: "grain" },
  { name: "Carafa III", lovibond: 525, gravity: 1.032, type: "grain" },
  {
    name: "Carafa Special I (Weyermann)",
    lovibond: 320,
    gravity: 1.036,
    type: "grain",
  },
  { name: "Carafoam", lovibond: 2, gravity: 1.033, type: "grain" },
  {
    name: "Caramel Malt - 120L (Briess)",
    lovibond: 120,
    gravity: 1.032,
    type: "grain",
  },
  {
    name: "Caramel Malt - 80L 6-Row (Briess)",
    lovibond: 80,
    gravity: 1.033,
    type: "grain",
  },
  { name: "Caramel Wheat Malt", lovibond: 46, gravity: 1.035, type: "grain" },
  {
    name: "Caramel/Crystal Malt - 10L",
    lovibond: 10,
    gravity: 1.035,
    type: "grain",
  },
  {
    name: "Caramel/Crystal Malt - 150L",
    lovibond: 150,
    gravity: 1.035,
    type: "grain",
  },
  {
    name: "Caramel/Crystal Malt - 15L",
    lovibond: 15,
    gravity: 1.035,
    type: "grain",
  },
  {
    name: "Caramel/Crystal Malt - 20L",
    lovibond: 20,
    gravity: 1.035,
    type: "grain",
  },
  {
    name: "Caramel/Crystal Malt - 30L",
    lovibond: 30,
    gravity: 1.035,
    type: "grain",
  },
  {
    name: "Caramel/Crystal Malt - 40L",
    lovibond: 40,
    gravity: 1.034,
    type: "grain",
  },
  {
    name: "Caramel/Crystal Malt - 60L",
    lovibond: 60,
    gravity: 1.034,
    type: "grain",
  },
  {
    name: "Caramel/Crystal Malt - 80L",
    lovibond: 80,
    gravity: 1.034,
    type: "grain",
  },
  {
    name: "Caramel/Crystal Malt - 90L",
    lovibond: 90,
    gravity: 1.034,
    type: "grain",
  },
  {
    name: "Caramel/Crystal Malt - 120L",
    lovibond: 120,
    gravity: 1.033,
    type: "grain",
  },
  {
    name: "Caramunich I (Weyermann)",
    lovibond: 34,
    gravity: 1.036,
    type: "grain",
  },
  { name: "Caramunich Malt", lovibond: 56, gravity: 1.033, type: "grain" },
  { name: "Carapils (Briess)", lovibond: 1, gravity: 1.034, type: "grain" },
  {
    name: "Carapils 6-Row (Briess)",
    lovibond: 1,
    gravity: 1.034,
    type: "grain",
  },
  { name: "Carared", lovibond: 20, gravity: 1.035, type: "grain" },
  { name: "Caravienne Malt", lovibond: 22, gravity: 1.034, type: "grain" },
  { name: "Chocolate Malt", lovibond: 400, gravity: 1.031, type: "grain" },
  {
    name: "Chocolate Malt (Muntons)",
    lovibond: 385,
    gravity: 1.028,
    type: "grain",
  },
  {
    name: "Chocolate Malt (Thomas Fawcett)",
    lovibond: 508,
    gravity: 1.034,
    type: "grain",
  },
  { name: "Chocolate Malt Pale", lovibond: 225, gravity: 1.028, type: "grain" },
  { name: "Chocolate Rye Malt", lovibond: 250, gravity: 1.031, type: "grain" },
  {
    name: "Chocolate Wheat Malt",
    lovibond: 400,
    gravity: 1.033,
    type: "grain",
  },
  { name: "Corn Flaked", lovibond: 1, gravity: 1.037, type: "grain" },
  { name: "Crystal 40 2-Row", lovibond: 40, gravity: 10.32, type: "grain" },
  {
    name: "Crystal ETRUEtra Dark (Simpsons)",
    lovibond: 160,
    gravity: 1.035,
    type: "grain",
  },
  {
    name: "Crystal Medium (Simpsons)",
    lovibond: 55,
    gravity: 1.035,
    type: "grain",
  },
  {
    name: "English Crystal 50-60 L",
    lovibond: 55,
    gravity: 1.034,
    type: "grain",
  },
  { name: "Honey Malt", lovibond: 25, gravity: 1.037, type: "grain" },
  { name: "Kolsch Malt", lovibond: 4, gravity: 1.037, type: "grain" },
  { name: "Lager Malt", lovibond: 2, gravity: 1.038, type: "grain" },
  { name: "Maris Otter (Crisp)", lovibond: 4, gravity: 1.038, type: "grain" },
  { name: "Melanoiden Malt", lovibond: 20, gravity: 1.037, type: "grain" },
  {
    name: "Melanoidin (Weyermann)",
    lovibond: 27,
    gravity: 1.037,
    type: "grain",
  },
  { name: "Mild Malt", lovibond: 4, gravity: 1.037, type: "grain" },
  { name: "Munich 10L (Briess)", lovibond: 7, gravity: 1.035, type: "grain" },
  {
    name: "Munich 10L (Gambrinus)",
    lovibond: 10,
    gravity: 1.035,
    type: "grain",
  },
  { name: "Munich Malt", lovibond: 9, gravity: 1.037, type: "grain" },
  { name: "Munich Malt - 10L", lovibond: 10, gravity: 1.035, type: "grain" },
  { name: "Munich Malt - 20L", lovibond: 20, gravity: 1.035, type: "grain" },
  {
    name: "Munich Malt Light (Weyermann)",
    lovibond: 5,
    gravity: 1.037,
    type: "grain",
  },
  { name: "Oats Flaked", lovibond: 1, gravity: 1.037, type: "grain" },
  {
    name: "Oats Flaked (toasted)",
    lovibond: 15,
    gravity: 1.037,
    type: "grain",
  },
  {
    name: "Oats Golden Naked (Simpsons)",
    lovibond: 10,
    gravity: 1.032,
    type: "grain",
  },
  { name: "Oats Malted", lovibond: 1, gravity: 1.037, type: "grain" },
  { name: "Pale Ale Malt", lovibond: 3, gravity: 1.036, type: "grain" },
  {
    name: "Pale Ale Malt 2-Row (Briess)",
    lovibond: 3,
    gravity: 1.037,
    type: "grain",
  },
  { name: "Pale Chocolate", lovibond: 225, gravity: 1.028, type: "grain" },
  {
    name: "Pale Malt (2 Row) Belgian",
    lovibond: 3,
    gravity: 1.037,
    type: "grain",
  },
  { name: "Pale Malt (2 Row) UK", lovibond: 3, gravity: 1.036, type: "grain" },
  { name: "Pale Malt (2 Row) US", lovibond: 2, gravity: 1.036, type: "grain" },
  { name: "Pale Malt (6 Row) US", lovibond: 2, gravity: 1.035, type: "grain" },
  {
    name: "Pale Malt Golden Promise",
    lovibond: 2,
    gravity: 1.037,
    type: "grain",
  },
  { name: "Pale Malt Halcyon", lovibond: 2, gravity: 1.037, type: "grain" },
  { name: "Pale Malt Maris Otter", lovibond: 3, gravity: 1.038, type: "grain" },
  { name: "Peat Smoked Malt", lovibond: 2, gravity: 1.034, type: "grain" },
  {
    name: "Pilsner (2 Row) Belgian",
    lovibond: 2,
    gravity: 1.036,
    type: "grain",
  },
  {
    name: "Pilsner (2 Row) German",
    lovibond: 2,
    gravity: 1.037,
    type: "grain",
  },
  { name: "Pilsner (2 Row) UK", lovibond: 1, gravity: 1.036, type: "grain" },
  { name: "Pilsner (Weyermann)", lovibond: 1, gravity: 1.038, type: "grain" },
  { name: "Rice Flaked", lovibond: 1, gravity: 1.032, type: "grain" },
  { name: "Roasted Barley", lovibond: 300, gravity: 1.025, type: "grain" },
  { name: "Rye Malt", lovibond: 4, gravity: 1.029, type: "grain" },
  { name: "Rye Malt (Briess)", lovibond: 3, gravity: 1.035, type: "grain" },
  { name: "Rye Malt (Weyermann)", lovibond: 3, gravity: 1.029, type: "grain" },
  { name: "Rye Flaked", lovibond: 2, gravity: 1.036, type: "grain" },
  { name: "Rye Flaked (Briess)", lovibond: 4, gravity: 1.033, type: "grain" },
  { name: "Rye Flaked (toasted)", lovibond: 10, gravity: 1.036, type: "grain" },
  { name: "Sinamar (Wyermann)", lovibond: 153, gravity: 1.02, type: "grain" },
  { name: "Smoked Malt", lovibond: 9, gravity: 1.037, type: "grain" },
  {
    name: "Smoked Malt (BestMälz)",
    lovibond: 3,
    gravity: 1.037,
    type: "grain",
  },
  {
    name: "Special B (Castle Malting)",
    lovibond: 152,
    gravity: 1.035,
    type: "grain",
  },
  {
    name: "Smoked Malt (Hoepfner)",
    lovibond: 2,
    gravity: 1.037,
    type: "grain",
  },
  {
    name: "Smoked Malt (Weyermann)",
    lovibond: 2,
    gravity: 1.037,
    type: "grain",
  },
  {
    name: "Soft Candi Sugar Blanc (White)",
    lovibond: 0,
    gravity: 1.042,
    type: "grain",
  },
  {
    name: "Soft Candi Sugar Brun Foncé (Dark)",
    lovibond: 22,
    gravity: 1.042,
    type: "grain",
  },
  {
    name: "Soft Candi Sugar Brun Léger (Light)",
    lovibond: 6,
    gravity: 1.042,
    type: "grain",
  },
  {
    name: "Sparkling Ale Extract (Coopers)",
    lovibond: 45,
    gravity: 1.036,
    type: "dry_extract",
  },
  {
    name: "Special B (Dingemans)",
    lovibond: 147,
    gravity: 1.03,
    type: "grain",
  },
  { name: "Special B Malt", lovibond: 180, gravity: 1.03, type: "grain" },
  {
    name: "Special Pale (Cargill)",
    lovibond: 3,
    gravity: 1.036,
    type: "grain",
  },
  { name: "Special Roast", lovibond: 50, gravity: 1.033, type: "grain" },
  {
    name: "Special Roast (Briess)",
    lovibond: 50,
    gravity: 1.033,
    type: "grain",
  },
  {
    name: "Stout Extract (Coopers)",
    lovibond: 913,
    gravity: 1.036,
    type: "dry_extract",
  },
  { name: "Sugar Table (Sucrose)", lovibond: 1, gravity: 1.046, type: "grain" },
  { name: "Toasted Malt", lovibond: 27, gravity: 1.033, type: "grain" },
  { name: "Two-Row Pale Malt", lovibond: 3, gravity: 1.037, type: "grain" },
  {
    name: "Traditional Draught Extract (Coopers)",
    lovibond: 66,
    gravity: 1.036,
    type: "dry_extract",
  },
  { name: "Turbinado", lovibond: 10, gravity: 1.044, type: "grain" },
  { name: "Victory Malt", lovibond: 25, gravity: 1.034, type: "grain" },
  {
    name: "Victory Malt (Briess)",
    lovibond: 28,
    gravity: 1.034,
    type: "grain",
  },
  { name: "Vienna", lovibond: 4, gravity: 1.036, type: "grain" },
  { name: "Vienna (BestMälz)", lovibond: 4, gravity: 1.035, type: "grain" },
  { name: "Vienna (Durst Malz)", lovibond: 7, gravity: 1.037, type: "grain" },
  { name: "Vienna (Hoepfner)", lovibond: 4, gravity: 1.037, type: "grain" },
  { name: "Vienna Malt", lovibond: 3, gravity: 1.036, type: "grain" },
  { name: "Vienna Malt (Briess)", lovibond: 3, gravity: 1.036, type: "grain" },
  {
    name: "Vienna Malt (Gambrinus)",
    lovibond: 6,
    gravity: 1.037,
    type: "grain",
  },
  {
    name: "Vienna Malt (Great Western)",
    lovibond: 3,
    gravity: 1.037,
    type: "grain",
  },
  {
    name: "Vienna Malt (Weyermann)",
    lovibond: 3,
    gravity: 1.038,
    type: "grain",
  },
  { name: "Wheat", lovibond: 3, gravity: 1.038, type: "grain" },
  { name: "Wheat (BestMälz)", lovibond: 2, gravity: 1.036, type: "grain" },
  { name: "Wheat (Durst Malz)", lovibond: 3, gravity: 1.039, type: "grain" },
  {
    name: "Wheat - Red Malt (Briess)",
    lovibond: 2,
    gravity: 1.037,
    type: "grain",
  },
  {
    name: "Wheat - Soft Red Flaked (Briess)",
    lovibond: 1,
    gravity: 1.035,
    type: "grain",
  },
  {
    name: "Wheat - White Malt (Briess)",
    lovibond: 2,
    gravity: 1.039,
    type: "grain",
  },
  {
    name: "Wheat Beer Extract (Coopers)",
    lovibond: 33,
    gravity: 1.036,
    type: "dry_extract",
  },
  { name: "Wheat Dark (BestMälz)", lovibond: 9, gravity: 1.036, type: "grain" },
  {
    name: "Wheat dry_extract",
    lovibond: 8,
    gravity: 1.044,
    type: "dry_extract",
  },
  {
    name: "Wheat Liquid Extract",
    lovibond: 8,
    gravity: 1.036,
    type: "dry_extract",
  },
  {
    name: "Wheat Malt (Barrett Burston)",
    lovibond: 1,
    gravity: 1.037,
    type: "grain",
  },
  {
    name: "Wheat Malt (Gambrinus)",
    lovibond: 2,
    gravity: 1.039,
    type: "grain",
  },
  {
    name: "Wheat Malt Extract (Coopers)",
    lovibond: 33,
    gravity: 1.036,
    type: "dry_extract",
  },
  { name: "Wheat Malt Bel", lovibond: 2, gravity: 1.037, type: "grain" },
  { name: "Wheat Malt Dark", lovibond: 9, gravity: 1.039, type: "grain" },
  {
    name: "Wheat Malt Dark (Hoepfner)",
    lovibond: 8,
    gravity: 1.039,
    type: "grain",
  },
  {
    name: "Wheat Malt Dark (Weyermann)",
    lovibond: 7,
    gravity: 1.038,
    type: "grain",
  },
  { name: "Wheat Malt Ger", lovibond: 2, gravity: 1.039, type: "grain" },
  {
    name: "Wheat Malt Light (Hoepfner)",
    lovibond: 2,
    gravity: 1.039,
    type: "grain",
  },
  {
    name: "Wheat Malt Malt Craft (Joe White)",
    lovibond: 1,
    gravity: 1.038,
    type: "grain",
  },
  {
    name: "Wheat Malt Pale (Weyermann)",
    lovibond: 2,
    gravity: 1.038,
    type: "grain",
  },
  { name: "Wheat Malt White", lovibond: 2, gravity: 1.04, type: "grain" },
  { name: "Wheat Flaked", lovibond: 1, gravity: 1.035, type: "grain" },
  { name: "Wheat Red (Cargill)", lovibond: 2, gravity: 1.037, type: "grain" },
  { name: "Wheat Roasted", lovibond: 425, gravity: 1.025, type: "grain" },
  {
    name: "Wheat Roasted (Joe White)",
    lovibond: 750,
    gravity: 1.032,
    type: "grain",
  },
  { name: "Wheat Torrified", lovibond: 1, gravity: 1.036, type: "grain" },
  {
    name: "Wheat Torrified (Thomas Fawcett)",
    lovibond: 2,
    gravity: 1.035,
    type: "grain",
  },
  { name: "Wheat White (Cargill)", lovibond: 2, gravity: 1.038, type: "grain" },
  { name: "White Wheat Malt", lovibond: 2, gravity: 1.04, type: "grain" },
];

export default allMalts;
