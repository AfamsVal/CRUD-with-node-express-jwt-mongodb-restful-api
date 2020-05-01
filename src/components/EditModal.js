import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const EditModal = (props) => {
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState({ title: "", post: "" });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const toggle = () => {
    props.editHandle(props.content.id);
    setPosts({
      ...posts,
      title: props.content.title,
      post: props.content.post,
    });
    handleShow();
  };

  const onEditInput = (e) => {
    setPosts({ ...posts, [e.target.name]: e.target.value });
  };

  const onSubmitEdit = (e) => {
    e.preventDefault();
    const { title, post } = posts;

    let items = localStorage.getItem("contents");
    if (items.length >= 0) {
      items = JSON.parse(items);
      let editedItem = items.map((item) => {
        if (item.id === props.content.id) {
          item.title = title;
          item.post = post;
          item.date = new Date().getTime();
        }
        return item;
      });
      editedItem = JSON.stringify(editedItem);
      localStorage.setItem("contents", editedItem);
      props.updatedItem();
      handleClose();
    }
  };

  return (
    <React.Fragment>
      <i
        onClick={toggle}
        className="fas fa fa-pencil-square text-white"
        style={{ float: "right", cursor: "pointer", fontSize: "20px" }}
      ></i>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onSubmitEdit}>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={posts.title}
                onChange={onEditInput}
              />
            </div>
            <div className="form-group">
              <textarea
                className="form-control"
                placeholder="Enter new post..."
                rows="5"
                name="post"
                value={posts.post}
                onChange={onEditInput}
              ></textarea>
            </div>
            <Button variant="info" type="submit">
              <i className="fas fa fa-pencil-square text-white"></i> Update Now
            </Button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default EditModal;
