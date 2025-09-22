import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Calendar, User, Activity, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  details: any;
  ip_address: string;
  created_at: string;
  profiles?: {
    name: string;
    email: string;
  };
}

const AuditLogs = () => {
  const { getUserRole } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    email: '',
    name: '',
    action: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      
      // First get audit logs
      let auditQuery = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Apply filters
      if (searchFilters.action) {
        auditQuery = auditQuery.ilike('action', `%${searchFilters.action}%`);
      }
      if (searchFilters.dateFrom) {
        auditQuery = auditQuery.gte('created_at', searchFilters.dateFrom);
      }
      if (searchFilters.dateTo) {
        auditQuery = auditQuery.lte('created_at', searchFilters.dateTo);
      }

      const { data: auditData, error: auditError } = await auditQuery;
      if (auditError) throw auditError;

      if (!auditData) {
        setLogs([]);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(auditData.map(log => log.user_id))];
      
      // Get profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, name, email')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Create a map of user_id to profile
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.user_id, profile);
      });

      // Combine audit logs with profile data
      const logsWithProfiles = auditData.map(log => ({
        ...log,
        profiles: profilesMap.get(log.user_id) || null
      }));

      // Apply email filter if needed
      let filteredLogs = logsWithProfiles;
      if (searchFilters.email) {
        filteredLogs = logsWithProfiles.filter(log => 
          log.profiles?.email?.toLowerCase().includes(searchFilters.email.toLowerCase())
        );
      }

      setLogs(filteredLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchAuditLogs();
  };

  const clearFilters = () => {
    setSearchFilters({
      email: '',
      name: '',
      action: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const getActionBadge = (action: string) => {
    const actionColors: { [key: string]: string } = {
      user_login: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      user_logout: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      document_upload: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      user_created: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      document_approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      document_rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };

    return (
      <Badge 
        className={`${actionColors[action] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'}`}
        variant="secondary"
      >
        {action.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="p-8 shadow-elegant">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Audit Logs
            </h1>
            <p className="text-muted-foreground">
              Track user activities and system events
            </p>
          </div>

          {/* Search Filters */}
          <Card className="p-6 mb-6 bg-accent/10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="email-search">Email</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email-search"
                    placeholder="Search by email..."
                    value={searchFilters.email}
                    onChange={(e) => setSearchFilters({ ...searchFilters, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="action-search">Action</Label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="action-search"
                    placeholder="Search by action..."
                    value={searchFilters.action}
                    onChange={(e) => setSearchFilters({ ...searchFilters, action: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-from">Date From</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={searchFilters.dateFrom}
                  onChange={(e) => setSearchFilters({ ...searchFilters, dateFrom: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSearch} variant="hero">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </Card>

          {/* Audit Logs Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-accent/20">
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="animate-pulse bg-accent/20 h-4 w-32 rounded"></div>
                      </TableCell>
                      <TableCell>
                        <div className="animate-pulse bg-accent/20 h-6 w-20 rounded-full"></div>
                      </TableCell>
                      <TableCell>
                        <div className="animate-pulse bg-accent/20 h-4 w-48 rounded"></div>
                      </TableCell>
                      <TableCell>
                        <div className="animate-pulse bg-accent/20 h-4 w-24 rounded"></div>
                      </TableCell>
                      <TableCell>
                        <div className="animate-pulse bg-accent/20 h-4 w-32 rounded"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-accent/10">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{log.profiles?.name || 'Unknown User'}</p>
                            <p className="text-sm text-muted-foreground">{log.profiles?.email || log.user_id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getActionBadge(log.action)}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm text-muted-foreground truncate">
                            {log.details ? JSON.stringify(log.details) : 'No details'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-accent/20 px-2 py-1 rounded">
                          {log.ip_address}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {format(parseISO(log.created_at), 'MMM dd, yyyy')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(parseISO(log.created_at), 'HH:mm:ss')}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {logs.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground text-center">
              Showing {logs.length} recent audit entries
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AuditLogs;