import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid, Table as TableIcon, Plus } from "lucide-react";
import { DJsList } from "./DJsList";
import { DJsGrid } from "./DJsGrid";
import { CreateDJDialog } from "./CreateDJDialog";

export const DJsView = () => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>DJ Profiles</CardTitle>
            <CardDescription>Manage DJ information and documents</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border bg-background p-1">
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <TableIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New DJ
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "table" ? <DJsList /> : <DJsGrid />}
      </CardContent>

      <CreateDJDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </Card>
  );
};
