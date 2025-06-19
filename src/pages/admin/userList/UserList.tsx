import React, { useState, useEffect } from "react";
import { Card, Table, Button, Form } from "react-bootstrap";
import "./UserList.scss";
import PaginationComponent from "../../../components/ui/admin/pagination/PaginationComponent";
import UserService, { User } from "../../../services/UserService";

const UserList: React.FC = () => {
  // State for users and pagination
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await UserService.getPaginatedUsers(currentPage, searchTerm);
      
      if (response.status === 'success') {
        setUsers(response.data.users);
        setTotalPages(response.data.pagination.totalPages);
        setTotalUsers(response.data.pagination.totalUsers);
        
        // Reset selections when data changes
        setSelectedUsers([]);
      } else {
        throw new Error('Failed to load users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch users when pagination changes
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when search changes
      fetchUsers();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // fetchUsers will be called by the useEffect
  };
  
  // Handle individual user selection
  // @ts-ignore
  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // The debounced effect will handle the API call
  };
  
  return (
    <div className="user-list">
      <div className="user-header">
        <div>
          <h1>User List</h1>
          <div className="breadcrumb">Home &gt; Users</div>
        </div>
        
        <div className="filter-section d-flex justify-content-between align-items-center mb-4">
          <div className="search-box">
            <Form.Control
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <>
          <Card className="user-table-card">
            <Card.Body className="p-0">
              <div className="table-responsive" style={{maxWidth: '90vw'}}>
                <Table className="mb-0">
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>User ID</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Registration Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.fullName}</td>
                          <td>{user.id}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td className="address-cell">{user.address}</td>
                          <td>{user.registrationDate}</td>
                          <td>
                            <Button variant="link" className="p-0 view-btn">View</Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center py-4">
                          No users found. Try adjusting your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
          
          {totalPages > 1 && (
            <PaginationComponent 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              showNextButton={true}
              className="mt-4"
            />
          )}
          
          {users.length > 0 && (
            <div className="text-center mt-3 text-muted">
              Showing {users.length} of {totalUsers} users
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserList;