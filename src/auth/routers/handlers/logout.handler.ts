import { Request, Response } from "express";
import { authService } from "../../application/auth.service";
import { HttpStatus } from "../../../core/types/httpStatus";
import { jwtService } from "../../adapters/jwt.adapter";
import { securityDeviceRepository } from "../../devices/security-device.repository";

export async function logoutHandler(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        // Get refresh token from cookies
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            res.status(HttpStatus.Unauthorized).send();
            return;
        }

        // Verify refresh token to get payload
        const payload = await jwtService.verifyRefreshToken(refreshToken);
        if (!payload) {
            res.status(HttpStatus.Unauthorized).send();
            return;
        }

        // Logout through auth service (this will invalidate the refresh token session)
        const result = await authService.logout(refreshToken);
        
        if (result.status !== HttpStatus.NoContent) {
            res.status(result.status).json({ errorsMessages: result.extensions });
            return;
        }

        // Delete the device from security devices collection
        // This is important for the tests that check device list after logout
        try {
            await securityDeviceRepository.deleteByDeviceId(payload.deviceId);
        } catch (error) {
            console.error('Failed to delete device during logout:', error);
            // Continue with logout even if device deletion fails
        }

        // Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });

        // Return 204 No Content on successful logout
        res.status(HttpStatus.NoContent).send();
        return;
    } catch (error) {
        console.error('Error in logoutHandler:', error);
        res.status(HttpStatus.InternalServerError).send();
        return;
    }
}