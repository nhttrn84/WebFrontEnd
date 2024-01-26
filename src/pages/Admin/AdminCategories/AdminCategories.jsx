import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategory,
  getAllCategoryStatus,
  addAsyncCategory,
  fetchAsyncCategories,
  deleteAsyncCategory,
  updateAsyncCategory,
} from "../../../store/CategorySlice/CategorySlice";
import { STATUS } from "../../../utils/status";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import "react-multi-carousel/lib/styles.css";
import { Loading } from "../../../components";
import { Delete, Edit } from "../../../assets/icons";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminCategories = () => {
    const dispatch = useDispatch();
    const categoryList = useSelector(getAllCategory);
    const categoryListStatus = useSelector(getAllCategoryStatus);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
  
    const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [newCategory, setNewCategory] = useState({
      category: '',
      banner: '',
    });

    useEffect(() => {
      dispatch(fetchAsyncCategories());
    }, []);

    if (categoryListStatus === STATUS.LOADING) {
      return <Loading />;
    }

    const handleDelete = (categoryId) => {
      setCategoryIdToDelete(categoryId);
      setDeleteDialogOpen(true);
    };

    const handleEdit = (category) => {
      setCategoryToEdit(category);
      setEditDialogOpen(true);
    };
  
    const handleAdd = () => {
      setAddDialogOpen(true);
    };

    const handleConfirmDelete = () => {
      toast.success("Delete successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
  
      // After deleting, close the dialog
      dispatch(deleteAsyncCategory(categoryIdToDelete))
      .then(() => dispatch(fetchAsyncCategories()));
      setDeleteDialogOpen(false);
      setCategoryIdToDelete(null);
    };
  
    const handleCancelDelete = () => {
      // If the user cancels, close the dialog
      setDeleteDialogOpen(false);
      setCategoryIdToDelete(null);
    };
  
    const handleConfirmEdit = () => {
      dispatch(updateAsyncCategory({
        categoryId: categoryToEdit._id, 
        data: categoryToEdit
      }))
        .then(() => dispatch(fetchAsyncCategories()));

      toast.success("Edit successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
  
      // After editing, close the dialog
      setEditDialogOpen(false);
      setCategoryToEdit(null);
    };
  
    const handleCancelEdit = () => {
      // If the user cancels, close the dialog
      setEditDialogOpen(false);
      setCategoryToEdit(null);
    };
  
    const handleConfirmAdd = () => {
      if (newCategory.category == '' || newCategory.banner == ''){
        toast.error("You cannot leave the input blank", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
      else {
        toast.success("Add successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        dispatch(addAsyncCategory(newCategory))
        .then(() => dispatch(fetchAsyncCategories()));
        setAddDialogOpen(false);
        setNewCategory({
          category: '',
          banner: '',
        });
      }
    };
  
    const handleCancelAdd = () => {
      // If the user cancels, close the dialog
      setAddDialogOpen(false);
      setNewCategory({
        category: '',
        banner: '',
      });
    };
  
    const handleBannerInputChange = (event, dialogType) => {
      const bannerFile = event.target.files[0];
  
      if (bannerFile) {
        const reader = new FileReader();
        reader.onload = () => {
          // Update the banner image preview based on the dialog type
          if (dialogType === 'edit') {
            setCategoryToEdit((prevCategory) => ({
              ...prevCategory,
              banner: reader.result,
            }));
          } else if (dialogType === 'add') {
            setNewCategory((prevCategory) => ({
              ...prevCategory,
              banner: reader.result,
            }));
          }
        };
        reader.readAsDataURL(bannerFile);
      }
    };

    const responsive = {
        desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5,
        slidesToSlide: 5, // optional, default to 1.
        },
        tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 2, // optional, default to 1.
        },
        mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1, // optional, default to 1.
        },
    };

    return (
        <div className="flex flex-col bg-grey-100 items-center gap-y-[30px] pb-[50px]">
            <div className="max-h-[520px] max-w-[1200px] w-[1200px] bg-white mt-[20px] border border-grey-300 rounded-lg shadow-sm flex gap-2">
            <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Banner</TableCell>
                  <TableCell>
                      <Button variant="contained" color="success" onClick={() => handleAdd()}>
                          Add
                      </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoryList.map((category, index) => (
                  <TableRow key={index}>
                    <TableCell>{category._id.slice(-6)}</TableCell>
                    <TableCell>{category.category}</TableCell>
                    <TableCell>
                      <img
                        className="cursor-pointer"
                        src={category.banner}
                        alt={category.category}
                        width={'200px'}
                        height={'150px'}
                      />
                      
                        {/*onClick={() => {
                          navigate(`/product/category/${category.id}`);
                        }}*/}
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" color="error" onClick={() => handleDelete(category._id)}>
                        <Delete className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500" />
                        
                      </Button>
                      
                      <Button variant="contained" color="primary" onClick={() => handleEdit(category)}>
                        <Edit className="w-[20px] h-[20px] fill-dark group-hover:fill-grey-500" />
                      
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableContainer>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                Are you sure you want to delete this category?
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelDelete} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmDelete} color="secondary">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={handleCancelEdit}>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogContent>
                <TextField
                  label="Name"
                  value={categoryToEdit?.category || ''}
                  onChange={(e) => setCategoryToEdit((prevCategory) => ({ ...prevCategory, category: e.target.value }))}
                  fullWidth
                  style={{ marginBottom: '16px', marginTop: '16px' }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleBannerInputChange(e, 'edit')}
                />
                {categoryToEdit?.banner && (
                  <img src={categoryToEdit.banner} alt="Preview" width="100%" height="auto" />
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelEdit} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmEdit} color="secondary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>

            {/* Add Dialog */}
            <Dialog open={addDialogOpen} onClose={handleCancelAdd}>
              <DialogTitle>Add Category</DialogTitle>
              <DialogContent>
                <TextField
                  label="Name"
                  value={newCategory.category}
                  onChange={(e) => setNewCategory((prevCategory) => ({ ...prevCategory, category: e.target.value }))}
                  fullWidth
                  style={{ marginBottom: '16px', marginTop: '16px' }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleBannerInputChange(e, 'add')}
                />
                {newCategory.banner && (
                  <img src={newCategory.banner} alt="Preview" width="100%" height="auto" />
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelAdd} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmAdd} color="secondary">
                  Add
                </Button>
              </DialogActions>
            </Dialog>
            </div>
        </div>
    );
};

export default AdminCategories;
