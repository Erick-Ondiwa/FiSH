import React from "react";
import SupplierCard from "./SupplierCard";

const SupplierList = ({ suppliers, onBack, onMessage, onViewProfile }) => {
  return (
    <div className="p-10">

      {/* Header */}
      <h2 className="text-2xl font-bold mb-6">
        Verified Fingerlings Suppliers
      </h2>

      <button
        onClick={onBack}
        className="mb-6 text-sm text-blue-600"
      >
        ← Back to Guide
      </button>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <SupplierCard
            key={supplier.id}
            supplier={supplier}
            onMessage={onMessage}
            onViewProfile={onViewProfile}
          />
        ))}
      </div>
    </div>
  );
};

export default SupplierList;