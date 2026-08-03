interface AccordionSection {
  [sectionTitle: string]: string;
}

export  interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  collection: string;
  description: string;
  highlight: string;
  mainImage: string;
  gallery: string[];
  sizes: string[];
  selectedSize: string;
  newArrival: boolean;
  quantity: number;
  featured: boolean;
  rating: number;
  keywords: string[];
  accordion: AccordionSection[];
}