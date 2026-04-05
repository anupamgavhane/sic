import { createSlice } from '@reduxjs/toolkit';
import {
  fetchRooms,
  fetchMyRooms,
  fetchRoom,
  createRoom,
  joinRoom,
  leaveRoom,
  deleteRoom,
  removeMember,
} from './roomThunks';

const initialState = {
  rooms: [],
  myActiveRooms: [],
  myPastRooms: [],
  currentRoom: null,
  loading: false,
  error: null,
};

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    clearRoomError: (state) => {
      state.error = null;
    },
    clearCurrentRoom: (state) => {
      state.currentRoom = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all rooms
    builder.addCase(fetchRooms.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRooms.fulfilled, (state, action) => {
      state.loading = false;
      state.rooms = action.payload.rooms;
    });
    builder.addCase(fetchRooms.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to fetch rooms';
    });

    // Fetch my rooms
    builder.addCase(fetchMyRooms.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMyRooms.fulfilled, (state, action) => {
      state.loading = false;
      state.myActiveRooms = action.payload.activeRooms;
      state.myPastRooms = action.payload.pastRooms;
    });
    builder.addCase(fetchMyRooms.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to fetch your rooms';
    });

    // Fetch single room
    builder.addCase(fetchRoom.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRoom.fulfilled, (state, action) => {
      state.loading = false;
      state.currentRoom = action.payload.room;
    });
    builder.addCase(fetchRoom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to fetch room';
    });

    // Create room
    builder.addCase(createRoom.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createRoom.fulfilled, (state, action) => {
      state.loading = false;
      state.rooms.unshift(action.payload.room);
    });
    builder.addCase(createRoom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to create room';
    });

    // Join room
    builder.addCase(joinRoom.fulfilled, (state, action) => {
      const updated = action.payload.room;
      state.rooms = state.rooms.map((r) =>
        r._id === updated._id ? updated : r
      );
      // Add to myActiveRooms if not already there
      if (!state.myActiveRooms.find((r) => r._id === updated._id)) {
        state.myActiveRooms.push(updated);
      }
    });
    builder.addCase(joinRoom.rejected, (state, action) => {
      state.error = action.payload?.message || 'Failed to join room';
    });

    // Remove member
    builder.addCase(removeMember.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeMember.fulfilled, (state, action) => {
      state.loading = false;
      const updated = action.payload.room;
      // Update in all rooms
      state.rooms = state.rooms.map((r) =>
        r._id === updated._id ? updated : r
      );
      // Update in myActiveRooms
      state.myActiveRooms = state.myActiveRooms.map((r) =>
        r._id === updated._id ? updated : r
      );
      // Update currentRoom
      if (state.currentRoom?._id === updated._id) {
        state.currentRoom = updated;
      }
    });
    builder.addCase(removeMember.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to remove member';
    });

    // Leave room
    builder.addCase(leaveRoom.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(leaveRoom.fulfilled, (state, action) => {
      state.loading = false;
      const updated = action.payload.room;
      // Remove from myActiveRooms
      state.myActiveRooms = state.myActiveRooms.filter((r) => r._id !== updated._id);
      // Remove from rooms
      state.rooms = state.rooms.filter((r) => r._id !== updated._id);
      // Clear currentRoom
      if (state.currentRoom?._id === updated._id) {
        state.currentRoom = null;
      }
    });
    builder.addCase(leaveRoom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to leave room';
    });

    // Delete room
    builder.addCase(deleteRoom.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteRoom.fulfilled, (state, action) => {
      state.loading = false;
      const roomId = action.payload.roomId;
      // Remove from all states
      state.myActiveRooms = state.myActiveRooms.filter((r) => r._id !== roomId);
      state.rooms = state.rooms.filter((r) => r._id !== roomId);
      // Clear currentRoom
      if (state.currentRoom?._id === roomId) {
        state.currentRoom = null;
      }
    });
    builder.addCase(deleteRoom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to delete room';
    });
  },
});

export const { clearRoomError, clearCurrentRoom } = roomSlice.actions;
export default roomSlice.reducer;
