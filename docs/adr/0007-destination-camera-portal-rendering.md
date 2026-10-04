# Destination Camera Portal Rendering

Portal windows will render a destination camera texture with orientation correction and enough clipping/framing to make the linked space legible. We are deliberately avoiding true recursive portals for the MVP because the first acceptance test is convincing traversal, not infinite visual recursion.
