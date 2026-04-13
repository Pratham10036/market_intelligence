import { Alert, Skeleton } from "antd";
import "../utils/chartRegistry";
import { useTradeData } from "../hooks/useTradeData";
import TradeIntelHeaderSection from "../components/sections/tradeintel/TradeIntelHeaderSection";
import TradeIntelKpiSection from "../components/sections/tradeintel/TradeIntelKpiSection";
import TradeIntelMonthlyTrendSection from "../components/sections/tradeintel/TradeIntelMonthlyTrendSection";
import TradeIntelProductMixSection from "../components/sections/tradeintel/TradeIntelProductMixSection";
import TradeIntelTopCountriesSection from "../components/sections/tradeintel/TradeIntelTopCountriesSection";
import TradeIntelCategorySplitSection from "../components/sections/tradeintel/TradeIntelCategorySplitSection";
import TradeIntelDataTableSection from "../components/sections/tradeintel/TradeIntelDataTableSection";

const pageBackground: React.CSSProperties = {
  background:
    "radial-gradient(ellipse 70% 60% at 0% 0%, rgba(0, 209, 255, 0.14) 0%, transparent 60%)," +
    "radial-gradient(ellipse 60% 50% at 100% 100%, rgba(15, 36, 56, 0.06) 0%, transparent 60%)," +
    "linear-gradient(180deg, var(--color-background) 0%, var(--color-background-alt) 100%)",
};

const TradeIntelligencePage: React.FC = () => {
  const state = useTradeData();

  if (state.status === "loading") {
    return (
      <div className="min-h-[60vh]" style={pageBackground}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <Skeleton active paragraph={{ rows: 2 }} />
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton.Button
                key={i}
                active
                block
                style={{ height: 120, borderRadius: 12 }}
              />
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Skeleton.Button active block style={{ height: 320, borderRadius: 12 }} />
            <Skeleton.Button active block style={{ height: 320, borderRadius: 12 }} />
          </div>
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="min-h-[60vh]" style={pageBackground}>
        <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
          <Alert
            type="error"
            showIcon
            message="Unable to load dashboard data"
            description={
              <>
                <p>{state.error.message}</p>
                <p className="mt-2 text-sm">
                  Make sure the backend pipeline has been run at least once:
                  <code className="ml-1 rounded bg-background-alt px-1 py-0.5">
                    python -m app.pipeline.preprocess
                  </code>
                </p>
              </>
            }
          />
        </div>
      </div>
    );
  }

  const { data, isSample } = state;

  return (
    <div style={pageBackground}>
      <TradeIntelHeaderSection meta={data.meta} isSample={isSample} />
      <TradeIntelKpiSection kpi={data.kpi} />

      <section className="pb-6 sm:pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TradeIntelMonthlyTrendSection monthly={data.monthly} />
            </div>
            <TradeIntelProductMixSection products={data.product} />
          </div>
        </div>
      </section>

      <section className="pb-6 sm:pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <TradeIntelTopCountriesSection countries={data.country} />
            <TradeIntelCategorySplitSection categories={data.category} />
          </div>
        </div>
      </section>

      <TradeIntelDataTableSection rows={data.table} />
    </div>
  );
};

export default TradeIntelligencePage;
