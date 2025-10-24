import { useState } from "react";
import { Button } from "@/components/button";
import { LayoutGrid, Table as TableIcon, Plus } from "lucide-react";
import { VenuesList } from "./VenuesList";
import { VenuesGrid } from "./VenuesGrid";
import { CreateVenueDialog } from "./CreateVenueDialog";
import { Text } from "@/components/text";

export const VenuesView = () => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Text>Manage event venues and locations</Text>
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
            New Venue
          </Button>
        </div>
      </div>

      {viewMode === "table" ? <VenuesList /> : <VenuesGrid />}

      <CreateVenueDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};
