export type ListingMode = "buy" | "rent";

export type Vehicle = {
  id: string;
  name: string;
  brand: string;
  year: number;
  kilometers: number;
  location: string;
  price: number;
  rentPrice: number;
  image: string;
  imageAlt: string;
  badge?: string;
};

export const vehicles: Vehicle[] = [
  {
    id: "honda-sh-150i",
    name: "Honda SH 150i ABS",
    brand: "Honda",
    year: 2022,
    kilometers: 8400,
    location: "Quận 2, TP. Hồ Chí Minh",
    price: 93500000,
    rentPrice: 450000,
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Xe máy phong cách cổ điển đậu trên phố",
    badge: "Nổi bật",
  },
  {
    id: "vespa-sprint-150",
    name: "Vespa Sprint 150 S",
    brand: "Vespa",
    year: 2021,
    kilometers: 11200,
    location: "Ba Đình, Hà Nội",
    price: 76800000,
    rentPrice: 390000,
    image:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Chiếc xe máy màu tối được chụp ngoài trời",
  },
  {
    id: "yamaha-janus",
    name: "Yamaha Janus Premium",
    brand: "Yamaha",
    year: 2023,
    kilometers: 5200,
    location: "Hải Châu, Đà Nẵng",
    price: 28600000,
    rentPrice: 180000,
    image:
      "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Xe tay ga chụp nghiêng trong ánh sáng tự nhiên",
    badge: "Giá tốt",
  },
  {
    id: "honda-winner-x",
    name: "Honda Winner X ABS",
    brand: "Honda",
    year: 2022,
    kilometers: 9700,
    location: "Ninh Kiều, Cần Thơ",
    price: 34800000,
    rentPrice: 220000,
    image:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Xe mô tô chụp cận cảnh trên đường",
  },
];

export function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price);
}
