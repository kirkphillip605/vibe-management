import { useState } from "react";
import { Button } from "@/components/button";
import { Plus } from "lucide-react";
import { GigsList } from "./GigsList";
import { CreateGigDialog } from "./CreateGigDialog";
import { Text } from "@/components/text";

export const GigsView = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Text>Schedule and manage events</Text>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus />
          New Gig
        </Button>
      </div>

      <GigsList />

      <CreateGigDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};
