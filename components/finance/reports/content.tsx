"use client";

import React, { useState, useTransition } from "react";
import { exportReport } from "@/utils/export";
import { Report } from "@/types/reports/types";
import { CommonTable } from "@/components/table/table";
import { fields, formatValue, headers } from "@/utils/report";
import { getReport } from "@/app/actions/reports/getReport";
import { FilterReportDialog } from "./modals/filterReportDialog";
import { TableSkeleton } from "@/components/common/skeletonTable";

interface Response {
  report: Report[]
  hasNextPage: boolean
}

export const Content = ({
  initialReport,
}: {
  initialReport: Response
}) => {
  const [isPending, startTransition] = useTransition()

  const [data, setData] = useState(initialReport)
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(initialReport.hasNextPage)
  const [filters, setFilters] = useState<Record<string, string>>({})

  const handleExport = (format: string) => {
    exportReport(format, data.report);
  };

  const fetchPageData = (pageToLoad: number, appliedFilters = filters) => {
    startTransition(() => {
      getReport({ ...appliedFilters, page: String(pageToLoad) }).then((res) => {
        setData(res)
        setHasNextPage(res.hasNextPage)
        setPage(pageToLoad)
      })
    })
  }

  const handleFilterSubmit = (formData: FormData) => {
    const newFilters: Record<string, string> = {}

    const type = formData.get("type")?.toString()
    const productName = formData.get("productName")?.toString()
    const quantity = formData.get("quantity")?.toString()
    const reportDay = formData.get("reportDay")?.toString()

    if (type) newFilters.type = type
    if (productName) newFilters.productName = productName
    if (quantity) newFilters.quantity = quantity
    if (reportDay) newFilters.reportDay = reportDay

    setFilters(newFilters)
    fetchPageData(1, newFilters)
  }

  return (
    <main className="w-full p-4">
      {isPending ? (
        <TableSkeleton />
      ) : (
        <CommonTable
          data={data?.report ?? []}
          fields={fields}
          headers={headers}
          formatValue={formatValue}
          renderFilters={() => (
            <FilterReportDialog onSubmit={handleFilterSubmit} />
          )}
          onExport={handleExport}
          currentPage={page ?? 1}
          onPageChange={(newPage) => fetchPageData(newPage)}
          hasNextPage={hasNextPage}
        />
      )}
    </main>
  );
};
