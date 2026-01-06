export interface Item {
  id: number;
  name: string;
  image_url: string;
  quantity: number;
  status: "draft" | "confirmed";
}
export type Recipe = {
  id: number;
  name: string;
  image_url?: string;
  ingredients: string[];
  how_to_cook?: string;
};

export type RecipeTemp = {
  name: string;
  image_url?: string;
  ingredients: string[];
  how_to_cook?: string;
};