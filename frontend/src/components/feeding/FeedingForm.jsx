import { Fish, Loader2 } from "lucide-react";

const FeedingForm = ({ data, setData, onStart, loading }) => {
  const input =
    "w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-teal-500/40";

  const label =
    "text-xs uppercase tracking-wider text-slate-400";

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl space-y-6">

      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Fish className="text-teal-400" size={20} />
          <h3 className="text-lg font-semibold text-white">
            Start Feeding Plan
          </h3>
        </div>

        <p className="text-sm text-slate-400">
          Configure feeding parameters for optimal fish growth.
        </p>
      </div>

      {/* FORM */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* SPECIES */}
        <div>
          <label className={label}>Species</label>
          <select
            value={data.species}
            onChange={(e) =>
              setData((prev) => ({ ...prev, species: e.target.value }))
            }
            className={input}
          >
            <option value="tilapia">Tilapia</option>
            <option value="catfish">Catfish</option>
            <option value="trout">Trout</option>
            <option value="nile_perch">Nile Perch</option>
          </select>
        </div>

        {/* AGE GROUP */}
        <div>
          <label className={label}>Growth Stage</label>
          <select
            value={data.age_group}
            onChange={(e) =>
              setData((prev) => ({ ...prev, age_group: e.target.value }))
            }
            className={input}
          >
            <option value="fingerlings">Fingerlings</option>
            <option value="juvenile">Juvenile</option>
            <option value="adult">Adult</option>
          </select>
        </div>
      </div>

      {/* ACTION */}
      <button
        onClick={onStart}
        disabled={loading}
        className={`w-full py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition
          ${
            loading
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-slate-700 hover:bg-slate-500 text-white"
          }`}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Initializing...
          </>
        ) : (
          "Start Feeding Plan"
        )}
      </button>
    </div>
  );
};

export default FeedingForm;