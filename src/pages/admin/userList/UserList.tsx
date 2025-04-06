import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Button, Form } from "react-bootstrap";
import "./UserList.scss";
import PaginationComponent from "../../../components/ui/admin/pagination/PaginationComponent";

// Sample user data
const sampleUsers = [
  {
    id: "USR001",
    fullName: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    registrationDate: "Jan 15, 2023"
  },
  {
    id: "USR002",
    fullName: "Emily Johnson",
    email: "emily.j@example.com",
    phone: "+1 (555) 234-5678",
    address: "456 Park Ave, Boston, MA 02108",
    registrationDate: "Feb 22, 2023"
  },
  {
    id: "USR003",
    fullName: "Michael Brown",
    email: "m.brown@example.com",
    phone: "+1 (555) 345-6789",
    address: "789 Oak Dr, Chicago, IL 60601",
    registrationDate: "Mar 10, 2023"
  },
  {
    id: "USR004",
    fullName: "Sarah Williams",
    email: "sarah.w@example.com",
    phone: "+1 (555) 456-7890",
    address: "101 Pine St, San Francisco, CA 94105",
    registrationDate: "Apr 5, 2023"
  },
  {
    id: "USR005",
    fullName: "David Lee",
    email: "david.lee@example.com",
    phone: "+1 (555) 567-8901",
    address: "202 Maple Rd, Seattle, WA 98101",
    registrationDate: "May 18, 2023"
  },
  {
    id: "USR006",
    fullName: "Bruise Lee",
    email: "bruise.lee@example.com",
    phone: "+1 (555) 567-8901",
    address: "202 Maple Rd, Seattle, WA 98101",
    registrationDate: "May 18, 2023"
  }
];

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const usersPerPage = 5;
  
  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Handle select all checkbox
  const handleSelectAll = () => {
    if (!selectAll) {
      const allUserIds = currentUsers.map(user => user.id);
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers([]);
    }
    setSelectAll(!selectAll);
  };
  
  // Handle individual user selection
  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };
  
  // Update selectAll state when individual selections change
  useEffect(() => {
    if (currentUsers.length > 0 && selectedUsers.length === currentUsers.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedUsers, currentUsers]);
  
  return (
    <div className="user-list">
      <div className="user-header">
        <div>
          <h1>User List</h1>
          <div className="breadcrumb">Home &gt; Users</div>
        </div>
      </div>
      
      <Card className="user-table-card">
        <Card.Body className="p-0">
          <div className="table-responsive" style={{maxWidth: '90vw'}}>
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>
                    <Form.Check 
                      type="checkbox" 
                      checked={selectAll}
                      onChange={handleSelectAll}
                      aria-label="Select all users"
                    />
                  </th>
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
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <Form.Check 
                        type="checkbox" 
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        aria-label={`Select user ${user.fullName}`}
                      />
                    </td>
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
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      
      {totalPages > 1 && (
        <PaginationComponent 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
          showNextButton={true}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default UserList;