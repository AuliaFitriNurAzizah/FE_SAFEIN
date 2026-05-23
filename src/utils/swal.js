import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export const showAlert = (title, icon = 'success', text = '') => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonColor: '#3085d6',
  });
};

export const showToast = (title, icon = 'success') => {
  return Toast.fire({
    icon,
    title
  });
};

export const showConfirm = (title, text, icon = 'warning') => {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal'
  });
};

export default Swal;
