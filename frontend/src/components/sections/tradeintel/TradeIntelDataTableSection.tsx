import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useFadeIn } from "../../../hooks/useFadeIn";
import type { TradeTableRow } from "../../../types/tradeIntel";
import { fmtInt, fmtUSD } from "../../../utils/tradeFormat";

interface Props {
  rows: TradeTableRow[];
}

const columns: ColumnsType<TradeTableRow> = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    width: 120,
    render: (v: string | null) => v || "—",
  },
  {
    title: "Product (HS4)",
    dataIndex: "product",
    key: "product",
    width: 140,
    render: (v: string) => (
      <Tag
        style={{
          background: "rgba(0, 209, 255, 0.10)",
          color: "var(--color-navy)",
          border: "none",
          borderRadius: 999,
          padding: "2px 10px",
          fontWeight: 600,
        }}
      >
        {v || "—"}
      </Tag>
    ),
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    width: 180,
    render: (v: string) => v || "—",
  },
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
    width: 160,
    render: (v: string) => v || "—",
  },
  {
    title: "Value (USD)",
    dataIndex: "value",
    key: "value",
    width: 140,
    align: "right",
    render: (v: number) => fmtUSD(v || 0),
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    width: 120,
    align: "right",
    render: (v: number) => fmtInt(v || 0),
  },
];

const TradeIntelDataTableSection: React.FC<Props> = ({ rows }) => {
  const ref = useFadeIn<HTMLDivElement>();

  const dataSource = rows.map((r, i) => ({ ...r, key: `${r.date ?? "na"}-${i}` }));

  return (
    <section className="pb-10 pt-4 sm:pb-14 lg:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={ref} className="fade-up glass-card p-4 sm:p-6">
          <div className="mb-4 px-1">
            <h3 className="text-sm font-semibold text-heading sm:text-base">
              Data Preview
            </h3>
            <p className="mt-1 text-xs text-text-muted sm:text-[0.8rem]">
              First {rows.length} records from the unified dataset
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table<TradeTableRow>
              columns={columns}
              dataSource={dataSource}
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                size: "small",
              }}
              size="small"
              scroll={{ x: 860 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradeIntelDataTableSection;
