import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  Badge,
  Button,
  Popconfirm,
  message,
  notification,
} from "antd";
import { BellOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
  useMarkNotificationAsSeenMutation,
} from "../redux/slices/apiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../redux/slices/authSlice";
import { newUserSocket } from "../utils/userSocket";
import { newSocket } from "../utils/socket";

const NotificationDrawer = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data = [], isLoading, refetch } = useGetNotificationsQuery();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [markAsSeen] = useMarkNotificationAsSeenMutation();
  const { token } = useSelector(selectAuth);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [bulkSocket, setBulkSocket] = useState(null);
  const [notificationAudio, setNotificationAudio] = useState(null);

  useEffect(() => {
    setUnreadCount(data?.data?.filter((n) => !n?.read)?.length);
  }, [data]);


useEffect(() => {
  const unlockAudio = () => {
    const audio = new Audio("/sound.mp3"); 
    audio.preload = "auto";
    audio.volume = 1;
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      setNotificationAudio(audio);
      console.log("Audio unlocked and ready");
    }).catch((err) => {
      console.error("Unlock failed:", err);
    });

    // Remove listener after unlocking
    window.removeEventListener("click", unlockAudio);
  };

  // Add unlock listener on first user click
  window.addEventListener("click", unlockAudio);

  return () => window.removeEventListener("click", unlockAudio);
}, []);


  useEffect(() => {
    const socketInstance = newUserSocket(token);

    setSocket(socketInstance);

    return () => socketInstance.close();
  }, []);

  useEffect(() => {
    const socketInstance = newSocket(token);

    setBulkSocket(socketInstance);

    return () => socketInstance.close();
  }, []);

  useEffect(() => {
    if (socket == null) return;

    socket.on("newNotification", (data) => {
      console.log("data", data);
      refetch();

      //         notification.open({
      //   message: 'New Notification Alert',
      //   description: 'You have a new notification! Please check the notification window.',
      // });

     if (notificationAudio) {

        try {
      notificationAudio.currentTime = 0; // rewind
      notificationAudio.play().catch(err => {
        console.error("Playback failed:", err);
      });
    } catch (err) {
      console.error("Audio error:", err);
    }

    
}

    });

    return () => socket.off("newNotification");
  }, [socket,notificationAudio]);

  useEffect(() => {
    if (bulkSocket == null) return;

    bulkSocket.on("newBulkOrder", (data) => {
      console.log("data", data);
      refetch();
      if (notificationAudio) {

          try {
      notificationAudio.currentTime = 0; // rewind
      notificationAudio.play().catch(err => {
        console.error("Playback failed:", err);
      });
    } catch (err) {
      console.error("Audio error:", err);
    }


}



    });

    return () => bulkSocket.off("newBulkOrder");
  }, [bulkSocket,notificationAudio]);

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id).unwrap();
      refetch();
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const handleMarkAsSeen = async (item) => {
    try {
      if (!item?.seen) {
        await markAsSeen(item?.id).unwrap();
        refetch();
      }
      if (item?.refundId) {
        navigate(`/orders/refunds/${item?.refundId}`);
      }
      if (item?.orderId) {
        navigate(`/orders/view/${item?.orderId}`);
      }
      if (item?.bulkOrderId) {
        navigate(`/bulk-orders/view/${item?.bulkOrderId}`);
      }
    } catch (error) {
      toast.error("Failed to mark as seen");
    }
  };

  return (
    <>
      <Badge count={unreadCount} offset={[0, 8]} className="">
        <Button
          icon={<BellOutlined style={{ fontSize: "20px" }} />}
          type="text"
          // onClick={() => setOpen(true)}
           onClick={() => {
    // if (!notificationAudio) {
    //   const audio = new Audio("/sound.mp3");
    //   audio.play().then(() => {
    //     audio.pause(); 
    //     audio.currentTime = 0;
    //     setNotificationAudio(audio); 
    //   }).catch(err => {
    //     console.warn("Audio not allowed yet", err);
    //   });
    // }

    setOpen(true);
  }}
        />
      </Badge>

      <Drawer
        title="Notifications"
        className="p-0"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        width={300}
      >
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <List
            itemLayout="horizontal"
            className="p-0"
            dataSource={data?.data}
            renderItem={(item) => (
              <List.Item
                style={{
                  background: item?.seen ? "#fff" : "#e6f7ff",
                  cursor: "pointer",
                }}
                className="mb-1 rounded-md"
                actions={[
                  <Popconfirm
                    title="Are you sure to delete this notification?"
                    onConfirm={() => handleDelete(item.id)}
                    okText="Yes"
                    cancelText="No"
                    key="delete"
                  >
                    <Button
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <div onClick={() => handleMarkAsSeen(item)}>
                      {item?.description}
                    </div>
                  }
                  description={
                    <p>{new Date(item?.createdAt).toLocaleString()}</p>
                  }
                  className="p-1"
                />
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </>
  );
};

export default NotificationDrawer;
