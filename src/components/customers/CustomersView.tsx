import { useState } from "react";
import { Button } from "@/components/button";
import { LayoutGrid, Table as TableIcon, Plus } from "lucide-react";
import { CustomersList } from "./CustomersList";
import { CustomersGrid } from "./CustomersGrid";
import { CreateCustomerDialog } from "./CreateCustomerDialog";
import { Text } from "@/components/text";

export const CustomersView = () => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Text>Manage your customer database</Text>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-zinc-950/10 bg-white p-1 dark:border-white/10 dark:bg-zinc-900">
            <Button
              color={viewMode === "table" ? "dark/zinc" : "white"}
              onClick={() => setViewMode("table")}
            >
              <TableIcon />
            </Button>
            <Button
              color={viewMode === "grid" ? "dark/zinc" : "white"}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid />
            </Button>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus />
            New Customer
          </Button>
        </div>
      </div>

      {viewMode === "table" ? <CustomersList /> : <CustomersGrid />}

      <CreateCustomerDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};
