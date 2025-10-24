import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { GigsList } from "./GigsList";
import { CreateGigDialog } from "./CreateGigDialog";

export const GigsView = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gigs</CardTitle>
            <CardDescription>Schedule and manage events</CardDescription>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Gig
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <GigsList />
      </CardContent>

      <CreateGigDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </Card>
  );
};
