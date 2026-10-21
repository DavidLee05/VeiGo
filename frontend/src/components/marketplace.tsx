"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  formatPrice,
  type ListingMode,
  type Vehicle,
  vehicles,
} from "@/lib/vehicles";

function Mark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 36 36"
    >
      <path
        d="M5 22.5 9 14h17l5 8.5M7 22.5h22M10 14l2.2-4h10.6l2.2 4M12 22.5a3 3 0 1 0 6 0m4 0a3 3 0 1 0 6 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <path
        d="M13.5 17.5h9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4.2 4.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      fill={filled ? "currentColor" : "none"}
      viewBox="0 0 24 24"
    >
      <path
        d="M20.2 8.7c0 4.2-8.2 10-8.2 10s-8.2-5.8-8.2-10a4.3 4.3 0 0 1 8.2-1.8 4.3 4.3 0 0 1 8.2 1.8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
      <path
        d="M4 10h12m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function VehicleCard({
  vehicle,
  mode,
  isSaved,
  onToggleSaved,
}: {
  vehicle: Vehicle;
  mode: ListingMode;
  isSaved: boolean;
  onToggleSaved: (id: string) => void;
}) {
  return (
    <article className="vehicle-card">
      <div className="vehicle-image-wrap">
        <Image
          alt={vehicle.imageAlt}
          className="vehicle-image"
          fill
          sizes="(max-width: 680px) 100vw, (max-width: 1050px) 50vw, 25vw"
          src={vehicle.image}
        />
        <span className="vehicle-badge">{vehicle.badge ?? "Tin mẫu"}</span>
        <button
          aria-label={isSaved ? `Bỏ lưu ${vehicle.name}` : `Lưu ${vehicle.name}`}
          aria-pressed={isSaved}
          className={`save-button${isSaved ? " is-saved" : ""}`}
          onClick={() => onToggleSaved(vehicle.id)}
          type="button"
        >
          <HeartIcon filled={isSaved} />
        </button>
      </div>
      <div className="vehicle-info">
        <div className="vehicle-title-row">
          <h3>{vehicle.name}</h3>
        </div>
        <p className="vehicle-specs">
          {vehicle.year} <span>·</span> {formatPrice(vehicle.kilometers)} km
        </p>
        <p className="vehicle-location">{vehicle.location}</p>
        <div className="vehicle-price-row">
          <p className="vehicle-price">
            {formatPrice(mode === "buy" ? vehicle.price : vehicle.rentPrice)}
            <span>{mode === "buy" ? " ₫" : " ₫ / ngày"}</span>
          </p>
          <button
            aria-label={`Xem chi tiết ${vehicle.name}`}
            className="card-arrow"
            disabled
            title="Trang chi tiết sắp ra mắt"
            type="button"
          >
            <ArrowIcon />
          </button>
        </div>
      </div>
    </article>
  );
}

export function Marketplace() {
  const [mode, setMode] = useState<ListingMode>("buy");
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("Tất cả hãng");
  const [location, setLocation] = useState("Toàn quốc");
  const [activeCategory, setActiveCategory] = useState("Tất cả xe");
  const [under30Million, setUnder30Million] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);

  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");

    return vehicles.filter((vehicle) => {
      const matchesQuery =
        query.length === 0 ||
        `${vehicle.name} ${vehicle.brand} ${vehicle.location}`
          .toLocaleLowerCase("vi")
          .includes(query);
      const matchesBrand = brand === "Tất cả hãng" || vehicle.brand === brand;
      const matchesLocation =
        location === "Toàn quốc" || vehicle.location.includes(location);
      const matchesBudget = !under30Million || vehicle.price < 30000000;
      const matchesCategory =
        activeCategory === "Tất cả xe" ||
        (activeCategory === "Xe tay ga" &&
          ["SH", "Vespa", "Janus"].some((model) => vehicle.name.includes(model))) ||
        (activeCategory === "Xe côn tay" && vehicle.name.includes("Winner"));

      return (
        matchesQuery &&
        matchesBrand &&
        matchesLocation &&
        matchesBudget &&
        matchesCategory
      );
    });
  }, [activeCategory, brand, location, search, under30Million]);

  function toggleSaved(id: string) {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id],
    );
  }

  return (
    <main>
      <div className="announcement">
        <span className="announcement-dot" />
        Mua xe an tâm, thuê xe linh hoạt — VeiGo đồng hành cùng bạn
      </div>

      <header className="site-header">
        <a aria-label="VeiGo - Trang chủ" className="brand" href="#">
          <Mark className="brand-mark" />
          <span>vei<span>go</span></span>
        </a>
        <nav aria-label="Điều hướng chính" className="main-nav">
          <a className="nav-link active" href="#marketplace">
            Khám phá xe
          </a>
          <a className="nav-link" href="#how-it-works">
            Cách hoạt động
          </a>
          <a className="nav-link" href="#trust">
            Về VeiGo
          </a>
        </nav>
        <div className="header-actions">
          <button className="login-button" disabled title="Tính năng sắp ra mắt" type="button">
            Đăng nhập
          </button>
          <button className="sell-button" disabled title="Tính năng sắp ra mắt" type="button">
            Đăng tin miễn phí <span>↗</span>
          </button>
        </div>
      </header>

      <section aria-labelledby="hero-title" className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Chợ xe máy đã qua sử dụng</p>
          <h1 id="hero-title">
            Chọn xe đúng ý.
            <br />
            <em>Đi muôn nơi.</em>
          </h1>
          <p className="hero-description">
            Xe cũ chất lượng, thông tin minh bạch. Mua xe an tâm hay thuê xe
            linh hoạt — hành trình của bạn bắt đầu tại đây.
          </p>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span>H</span><span>M</span><span>L</span>
            </div>
            <p><strong>Dữ liệu minh họa</strong> cho trải nghiệm tìm xe VeiGo</p>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-frame">
            <Image
              alt="Xe máy cổ điển trong ánh nắng chiều"
              className="hero-image"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 48vw"
              src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1400&q=90"
            />
          </div>
          <div className="hero-image-shade" />
          <div className="image-caption">
            <span className="caption-kicker">Tìm thấy cảm giác tự do</span>
            <span className="caption-model">Chuyến đi của bạn, theo cách riêng.</span>
          </div>
          <div className="hero-stat">
            <span className="stat-icon">✳</span>
            <span><strong>Bản trải nghiệm</strong><small>Thông tin xe mẫu</small></span>
          </div>
          <span className="hero-index">01 <i /> 04</span>
        </div>
      </section>

      <section aria-label="Tìm xe" className="search-section">
        <div className="search-panel">
          <div className="search-panel-top">
            <div className="mode-switch" role="tablist" aria-label="Hình thức">
              <button
                aria-selected={mode === "buy"}
                className={mode === "buy" ? "mode-tab selected" : "mode-tab"}
                onClick={() => setMode("buy")}
                role="tab"
                type="button"
              >
                Mua xe
              </button>
              <button
                aria-selected={mode === "rent"}
                className={mode === "rent" ? "mode-tab selected" : "mode-tab"}
                onClick={() => setMode("rent")}
                role="tab"
                type="button"
              >
                Thuê xe
              </button>
            </div>
            <p>{mode === "buy" ? "Tìm chiếc xe dành riêng cho bạn" : "Linh hoạt theo từng hành trình"}</p>
          </div>
          <div className="search-controls">
            <label className="search-field query-field">
              <span className="field-icon"><SearchIcon /></span>
              <span className="field-content">
                <span className="field-label">Bạn đang tìm gì?</span>
                <input
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Tên xe, hãng xe..."
                  value={search}
                />
              </span>
            </label>
            <label className="search-field">
              <span className="field-icon location-icon">⌖</span>
              <span className="field-content">
                <span className="field-label">Khu vực</span>
                <select onChange={(event) => setLocation(event.target.value)} value={location}>
                  <option>Toàn quốc</option>
                  <option>TP. Hồ Chí Minh</option>
                  <option>Hà Nội</option>
                  <option>Đà Nẵng</option>
                  <option>Cần Thơ</option>
                </select>
              </span>
            </label>
            <label className="search-field brand-field">
              <span className="field-icon bike-icon"><Mark /></span>
              <span className="field-content">
                <span className="field-label">Hãng xe</span>
                <select onChange={(event) => setBrand(event.target.value)} value={brand}>
                  <option>Tất cả hãng</option>
                  <option>Honda</option>
                  <option>Vespa</option>
                  <option>Yamaha</option>
                </select>
              </span>
            </label>
            <button className="search-submit" onClick={() => document.querySelector("#marketplace")?.scrollIntoView({ behavior: "smooth" })} type="button">
              <SearchIcon /><span>Tìm xe</span>
            </button>
          </div>
        </div>
        <div className="search-note">
          <span className="spark">✦</span>
          <span>Gợi ý hôm nay:</span>
          {["Honda SH", "Xe dưới 30 triệu", "Thuê xe cuối tuần"].map((suggestion) => (
            <button
              className="suggestion"
              key={suggestion}
              onClick={() => {
                const isHonda = suggestion.includes("Honda");
                const isBudget = suggestion.includes("30 triệu");
                setMode(suggestion.includes("Thuê") ? "rent" : "buy");
                setSearch(isHonda ? "Honda" : "");
                setBrand("Tất cả hãng");
                setLocation("Toàn quốc");
                setUnder30Million(isBudget);
              }}
              type="button"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="listing-title" className="listings" id="marketplace">
        <div className="section-heading">
          <div>
            <p className="eyebrow section-eyebrow">DÀNH CHO BẠN</p>
            <h2 id="listing-title">Xe được quan tâm <span>tuần này</span></h2>
          </div>
          <a className="view-all" href="#marketplace">
            Khám phá tất cả <ArrowIcon />
          </a>
        </div>
        <div aria-label="Lọc loại xe" className="category-tabs">
          {["Tất cả xe", "Xe tay ga", "Xe côn tay"].map((category) => (
            <button
              aria-pressed={activeCategory === category}
              className={activeCategory === category ? "category-tab current" : "category-tab"}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
              {category === "Tất cả xe" ? <span>04</span> : null}
            </button>
          ))}
          <p className="listing-count">{filteredVehicles.length} xe phù hợp</p>
        </div>
        {filteredVehicles.length > 0 ? (
          <div className="vehicle-grid">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                isSaved={saved.includes(vehicle.id)}
                key={vehicle.id}
                mode={mode}
                onToggleSaved={toggleSaved}
                vehicle={vehicle}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>⌕</span>
            <h3>Chưa tìm thấy xe phù hợp</h3>
            <p>Thử đổi từ khóa hoặc bộ lọc để khám phá thêm lựa chọn.</p>
            <button
              onClick={() => {
                setSearch("");
                setBrand("Tất cả hãng");
                setLocation("Toàn quốc");
                setActiveCategory("Tất cả xe");
                setUnder30Million(false);
              }}
              type="button"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </section>

      <section aria-labelledby="trust-title" className="trust-strip" id="trust">
        <div className="trust-intro">
          <p className="eyebrow">VÌ BẠN XỨNG ĐÁNG</p>
          <h2 id="trust-title">Trải nghiệm xe cũ, <em>theo cách rõ ràng hơn.</em></h2>
        </div>
        <div className="trust-item">
          <span className="trust-number">01</span>
          <span><strong>Thông tin dễ xem</strong><small>Thiết kế ưu tiên dữ liệu xe rõ ràng</small></span>
        </div>
        <div className="trust-item">
          <span className="trust-number">02</span>
          <span><strong>Mua và thuê</strong><small>Hai nhu cầu, cùng một nơi khám phá</small></span>
        </div>
        <div className="trust-item">
          <span className="trust-number">03</span>
          <span><strong>Khám phá thuận tiện</strong><small>Tìm theo mẫu xe và khu vực</small></span>
        </div>
      </section>

      <footer className="site-footer" id="how-it-works">
        <a aria-label="VeiGo - Trang chủ" className="brand footer-brand" href="#">
          <Mark className="brand-mark" /><span>vei<span>go</span></span>
        </a>
        <p>Hành trình mới, bắt đầu từ một lựa chọn tốt.</p>
        <span>© 2026 VeiGo. Đi đâu cũng có xe.</span>
      </footer>
    </main>
  );
}
