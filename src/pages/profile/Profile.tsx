
import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LogOut, User } from "lucide-react";

export default function Profile() {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AuthLayout requireAuth>
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          
          <Card className="max-w-3xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {authState.user?.name.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{authState.user?.name}</CardTitle>
                  <CardDescription className="text-lg">{authState.user?.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Role</span>
                  <Badge variant="secondary" className="px-3 py-1 text-sm">
                    {authState.user?.role === "admin" ? "Administrator" : "User"}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Account Status</span>
                  <Badge className="bg-status-completed text-white px-3 py-1 text-sm">Active</Badge>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => {}}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Edit Profile
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </DashboardLayout>
    </AuthLayout>
  );
}
