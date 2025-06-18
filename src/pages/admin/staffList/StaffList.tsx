import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Button, Form } from "react-bootstrap";
import "./StaffList.scss";
import PaginationComponent from "../../../components/ui/admin/pagination/PaginationComponent";
import StaffService, { Staff } from "../../../services/StaffService";
import StaffModal from "../../../components/ui/admin/staffModal/StaffModal";

const StaffList: React.FC = () => {
  // State for staff and pagination
  const [staff, setStaff] = useState<Staff[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStaff, setTotalStaff] = useState(0);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedStaffMember, setSelectedStaffMember] = useState<Staff | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  // Password visibility state
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(
    new Set()
  );

  // Fetch staff from API
  const fetchStaff = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await StaffService.getPaginatedStaff(
        currentPage,
        searchTerm
      );

      if (response.status === "success") {
        setStaff(response.data.staff);
        setTotalPages(response.data.pagination.totalPages);
        setTotalStaff(response.data.pagination.totalStaff);

        // Reset selections when data changes
        setSelectedStaff([]);
      } else {
        throw new Error("Failed to load staff");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error fetching staff:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch staff when pagination changes
  useEffect(() => {
    fetchStaff();
  }, [currentPage]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when search changes
      fetchStaff();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle individual staff selection
  const handleSelectStaff = (staffId: string) => {
    if (selectedStaff.includes(staffId)) {
      setSelectedStaff(selectedStaff.filter((id) => id !== staffId));
    } else {
      setSelectedStaff([...selectedStaff, staffId]);
    }
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle add new member
  const handleAddNewMember = () => {
    setSelectedStaffMember(null);
    setModalMode("add");
    setShowModal(true);
  };

  // Handle row click (edit staff member)
  const handleRowClick = (staffMember: Staff) => {
    setSelectedStaffMember(staffMember);
    setModalMode("edit");
    setShowModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedStaffMember(null);
  };

  // Handle modal save
  const handleModalSave = async (staffData: Partial<Staff>) => {
    try {
      if (modalMode === "add") {
        await StaffService.createStaff(staffData);
      } else {
        await StaffService.updateStaff(selectedStaffMember!.id, staffData);
      }

      // Refresh the list
      fetchStaff();
      handleModalClose();
    } catch (err) {
      console.error("Error saving staff:", err);
      // Handle error (you might want to show a toast notification)
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (staffId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    setVisiblePasswords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(staffId)) {
        newSet.delete(staffId);
      } else {
        newSet.add(staffId);
      }
      return newSet;
    });
  };

  return (
    <div className="staff-list">
      <div className="staff-header">
        <div>
          <h1>Staff List</h1>
          <div className="breadcrumb">Home &gt; Staff List</div>
        </div>

        <Button
          variant="dark"
          className="add-member-btn"
          onClick={handleAddNewMember}
        >
          <i className="bi-plus me-2" />
          ADD NEW MEMBER
        </Button>
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
          <Card className="staff-table-card">
            <Card.Body className="p-0">
              <div className="table-responsive" style={{ maxWidth: "90vw" }}>
                <Table className="mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Company</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.length > 0 ? (
                      staff.map((member) => (
                        <tr
                          key={member.id}
                          className="clickable-row"
                          onClick={() => handleRowClick(member)}
                        >
                          <td>{member.id}</td>
                          <td>{`${member.firstName} ${member.lastName}`}</td>
                          <td>{member.mobile}</td>
                          <td>{member.email}</td>
                          <td>{member.company}</td>                        
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                          No staff members found. Try adjusting your search.
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

          {staff.length > 0 && (
            <div className="text-center mt-3 text-muted">
              Showing {staff.length} of {totalStaff} staff members
            </div>
          )}
        </>
      )}

      <StaffModal
        show={showModal}
        onHide={handleModalClose}
        onSave={handleModalSave}
        staffMember={selectedStaffMember}
        mode={modalMode}
      />
    </div>
  );
};

export default StaffList;
