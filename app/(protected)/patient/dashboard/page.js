"use client";

import { useState } from "react";

export default function PatientDashboard() {
  const [weight, setWeight] = useState("");
  const [water, setWater] = useState("");
  const [steps, setSteps] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Supabase'e measurements insert edilecek.
    alert("Demo: ölçümler kaydedilmiş gibi varsayılıyor.");
    setWeight("");
    setWater("");
    setSteps("");
  };

  return (
    <main className="main-shell">
      <div className="card" style={{ maxWidth: 480 }}>
        <div className="badge">Hasta Paneli · Demo</div>
        <h1>Bugünkü Takip</h1>
        <p>
          Buradan günlük kilonu, su tüketimini ve adım sayını gireceksin.
          Doktorun bu verileri klinik panelinden görecek.
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
              Kilo (kg)
            </label>
            <input
              className="input"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
              Su (ml)
            </label>
            <input
              className="input"
              type="number"
              value={water}
              onChange={(e) => setWater(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
              Adım
            </label>
            <input
              className="input"
              type="number"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
            />
          </div>

          <button type="submit" className="button">
            Bugünü kaydet
          </button>
        </form>
      </div>
    </main>
  );
}
